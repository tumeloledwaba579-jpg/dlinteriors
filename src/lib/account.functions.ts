import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const resendOwnConfirmation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = (context as any).userId;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: user, error: userErr } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userErr) throw new Error(userErr.message);
    if (!user?.user?.email) throw new Error("No email found for this account.");

    const { error } = await supabaseAdmin.auth.resend({ type: "signup", email: user.user.email });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
