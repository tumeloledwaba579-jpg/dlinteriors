import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listAccessRequests, decideAccessRequest, type AccessRequest } from "@/lib/admin-access.functions";
import { Btn, Card } from "./ui";

const POLL_MS = 20000;

export function useAccessRequests() {
  const fetchRequests = useServerFn(listAccessRequests);
  const [requests, setRequests] = useState<AccessRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setRequests(await fetchRequests());
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? "Could not load access requests.");
    }
  }, [fetchRequests]);

  useEffect(() => {
    load();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, POLL_MS);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  const pending = (requests ?? []).filter((r) => r.status === "pending");
  return { requests, pending, error, reload: load };
}

export function AdminAccessRequests({ onChanged }: { onChanged?: () => void }) {
  const decide = useServerFn(decideAccessRequest);
  const { requests, error, reload } = useAccessRequests();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const act = async (id: string, approve: boolean) => {
    setBusyId(id);
    setMsg(null);
    try {
      await decide({ data: { id, approve } });
      await reload();
      onChanged?.();
      setMsg(approve ? "Access granted." : "Request declined.");
    } catch (err: any) {
      setMsg(err?.message ?? "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  if (!requests) return null;

  const pending = requests.filter((r) => r.status === "pending");
  const decided = requests.filter((r) => r.status !== "pending").slice(0, 5);

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="eyebrow">Access requests</h2>
        {pending.length > 0 && (
          <span className="rounded-full bg-foreground px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-background">
            {pending.length} awaiting you
          </span>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}
      {msg && <p className="mt-3 text-sm text-muted-foreground" role="status" aria-live="polite">{msg}</p>}

      {pending.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No one is waiting for elevated access.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {pending.map((r) => (
            <li key={r.id} className="border-b border-border/60 pb-4 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm break-all">{r.name ? `${r.name} · ${r.email}` : r.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Requested {new Date(r.createdAt).toLocaleString()}
                  </p>
                  {r.reason && <p className="mt-2 text-sm text-muted-foreground">“{r.reason}”</p>}
                </div>
                <div className="flex gap-2">
                  <Btn disabled={busyId === r.id} onClick={() => act(r.id, true)}>
                    {busyId === r.id ? "…" : "Approve"}
                  </Btn>
                  <Btn variant="danger" disabled={busyId === r.id} onClick={() => act(r.id, false)}>
                    Decline
                  </Btn>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {decided.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <p className="eyebrow">Recently decided</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {decided.map((r) => (
              <li key={r.id}>
                {r.email} — {r.status === "approved" ? "approved" : "declined"}
                {r.decidedAt ? ` on ${new Date(r.decidedAt).toLocaleDateString()}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
