import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export type AccessRequest = {
  id: string;
  userId: string;
  email: string;
  name: string;
  reason: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
  decidedAt: string | null;
};

/** Current user asks the studio admin for elevated (admin) access. */
export const requestAdminAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { reason?: string }) => ({
    reason: (input?.reason ?? "").slice(0, 1000),
  }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;

    const { data: already } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (already) return { ok: true, status: "approved" as const };

    const { data: pending } = await supabase
      .from("admin_access_requests")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "pending")
      .maybeSingle();
    if (pending) return { ok: true, status: "pending" as const };

    const { error } = await supabase
      .from("admin_access_requests")
      .insert({ user_id: userId, reason: data.reason.trim(), status: "pending" });
    if (error) throw new Error(error.message);
    return { ok: true, status: "pending" as const };
  });

/** Latest request belonging to the signed-in user (for status display). */
export const myAdminAccessRequest = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    const { data, error } = await supabase
      .from("admin_access_requests")
      .select("id, status, reason, created_at, decided_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      id: data.id as string,
      status: data.status as AccessRequest["status"],
      reason: data.reason as string,
      createdAt: data.created_at as string,
      decidedAt: (data.decided_at as string | null) ?? null,
    };
  });

/** Admin view: every access request, newest first, with the requester's email. */
export const listAccessRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AccessRequest[]> => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error } = await supabaseAdmin
      .from("admin_access_requests")
      .select("id, user_id, reason, status, created_at, decided_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    if (!rows?.length) return [];

    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const byId = new Map((list?.users ?? []).map((u) => [u.id, u]));

    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", rows.map((r) => r.user_id));
    const names = new Map((profiles ?? []).map((p) => [p.user_id, p.display_name]));

    return rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      email: byId.get(r.user_id)?.email ?? "(unknown)",
      name: names.get(r.user_id) || "",
      reason: r.reason ?? "",
      status: r.status as AccessRequest["status"],
      createdAt: r.created_at,
      decidedAt: r.decided_at ?? null,
    }));
  });

/** Admin approves (grants the admin role) or denies a request. */
export const decideAccessRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; approve: boolean }) => {
    if (!input?.id || typeof input.id !== "string") throw new Error("id is required");
    return { id: input.id, approve: !!input.approve };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: req, error: reqErr } = await supabaseAdmin
      .from("admin_access_requests")
      .select("id, user_id, status")
      .eq("id", data.id)
      .maybeSingle();
    if (reqErr) throw new Error(reqErr.message);
    if (!req) throw new Error("That request no longer exists.");
    if (req.status !== "pending") throw new Error("That request has already been decided.");

    if (data.approve) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: req.user_id, role: "admin" }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    }

    const { error: updErr } = await supabaseAdmin
      .from("admin_access_requests")
      .update({
        status: data.approve ? "approved" : "denied",
        decided_at: new Date().toISOString(),
        decided_by: (context as any).userId,
      })
      .eq("id", req.id);
    if (updErr) throw new Error(updErr.message);

    return { ok: true };
  });
