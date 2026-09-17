import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listUsers, grantAdmin, revokeAdmin, resendConfirmation, type AdminUser } from "@/lib/admin-users.functions";
import { Btn, Card } from "./ui";
import { AdminAccessRequests } from "./AdminAccessRequests";

const POLL_MS = 20000;

const PROVIDER_LABELS: Record<string, string> = {
  email: "Email",
  google: "Google",
  apple: "Apple",
};

export function AdminUsers() {
  const fetchUsers = useServerFn(listUsers);
  const grant = useServerFn(grantAdmin);
  const revoke = useServerFn(revokeAdmin);
  const resend = useServerFn(resendConfirmation);


  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const inFlight = useRef(false);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (inFlight.current) return;
    inFlight.current = true;
    if (!opts?.silent) setRefreshing(true);
    try {
      setUsers(await fetchUsers());
      setUpdatedAt(new Date());
      setMsg(null);
    } catch (err: any) {
      setMsg(err.message ?? "Could not load accounts.");
    } finally {
      inFlight.current = false;
      setRefreshing(false);
    }
  }, [fetchUsers]);

  useEffect(() => {
    load();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") load({ silent: true });
    }, POLL_MS);
    const onFocus = () => load({ silent: true });
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [load]);

  const act = async (id: string, makeAdmin: boolean) => {
    setBusyId(id); setMsg(null);
    try {
      if (makeAdmin) await grant({ data: { userId: id } });
      else await revoke({ data: { userId: id } });
      await load({ silent: true });
    } catch (err: any) {
      setMsg(err.message ?? "Something went wrong.");
    } finally { setBusyId(null); }
  };

  const doResend = async (u: AdminUser) => {
    setBusyId(u.id); setMsg(null); setNotice(null);
    try {
      await resend({ data: { email: u.email } });
      setNotice(`Confirmation email sent to ${u.email}.`);
    } catch (err: any) {
      setMsg(err.message ?? "Could not send the confirmation email.");
    } finally { setBusyId(null); }
  };

  if (!users) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4 max-w-5xl">
      <AdminAccessRequests onChanged={() => load({ silent: true })} />
      {msg && <p className="text-sm text-destructive" role="alert">{msg}</p>}
      {notice && <p className="text-sm text-muted-foreground" role="status" aria-live="polite">{notice}</p>}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground" role="status" aria-live="polite">
          {updatedAt ? `${users.length} account${users.length === 1 ? "" : "s"} · updated ${updatedAt.toLocaleTimeString()}` : ""}
        </p>
        <Btn disabled={refreshing} onClick={() => load()}>
          {refreshing ? "Refreshing…" : "Refresh"}
        </Btn>
      </div>
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-border">
              <th className="pb-3 eyebrow font-normal">Email</th>
              <th className="pb-3 eyebrow font-normal">Signed up with</th>
              <th className="pb-3 eyebrow font-normal">Joined</th>
              <th className="pb-3 eyebrow font-normal">Last sign in</th>
              <th className="pb-3 eyebrow font-normal">Status</th>
              <th className="pb-3 eyebrow font-normal text-right">Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/60 last:border-0 align-top">
                <td className="py-3 pr-4 break-all">{u.email}</td>
                <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                  {u.providers.length
                    ? u.providers.map((p) => PROVIDER_LABELS[p] ?? p).join(", ")
                    : "—"}
                </td>
                <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                  {u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleString() : "Never signed in"}
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {u.confirmed ? (
                    "Confirmed"
                  ) : (
                    <div className="space-y-2">
                      <span className="block">Signed up, email not confirmed</span>
                      <Btn disabled={busyId === u.id} onClick={() => doResend(u)}>
                        {busyId === u.id ? "…" : "Resend confirmation"}
                      </Btn>
                    </div>
                  )}
                </td>
                <td className="py-3 text-right">
                  {u.isAdmin ? (
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-xs uppercase tracking-[0.18em]">Admin</span>
                      <Btn variant="danger" disabled={busyId === u.id} onClick={() => act(u.id, false)}>
                        {busyId === u.id ? "…" : "Remove"}
                      </Btn>
                    </div>
                  ) : (
                    <Btn disabled={busyId === u.id} onClick={() => act(u.id, true)}>
                      {busyId === u.id ? "…" : "Make admin"}
                    </Btn>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="text-xs text-muted-foreground">
        The list refreshes automatically, so new sign-ups and sign-ins appear here on their own. Accounts that haven't confirmed their email can't sign in yet. There must always be at least one admin.
      </p>

    </div>
  );
}
