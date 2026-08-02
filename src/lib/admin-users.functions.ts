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

export type AdminUser = {
  id: string;
  email: string;
  createdAt: string;
  confirmed: boolean;
  isAdmin: boolean;
};

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUser[]> => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) throw new Error(error.message);

    const { data: roles, error: rolesErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .eq("role", "admin");
    if (rolesErr) throw new Error(rolesErr.message);

    const adminIds = new Set((roles ?? []).map((r) => r.user_id));

    return list.users
      .map((u) => ({
        id: u.id,
        email: u.email ?? "(no email)",
        createdAt: u.created_at,
        confirmed: !!u.email_confirmed_at,
        isAdmin: adminIds.has(u.id),
      }))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  });

export const grantAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => {
    if (!input?.userId || typeof input.userId !== "string") throw new Error("userId is required");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: data.userId, role: "admin" }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const revokeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => {
    if (!input?.userId || typeof input.userId !== "string") throw new Error("userId is required");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    if (data.userId === (context as any).userId) {
      throw new Error("You cannot remove your own admin access.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(countErr.message);
    if ((count ?? 0) <= 1) throw new Error("There must be at least one admin.");

    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", "admin");
    if (error) throw new Error(error.message);
    return { ok: true };
  });
