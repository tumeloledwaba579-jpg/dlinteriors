# Grant admin access to an account

## Current state

There are two accounts on the site. `tumeloledwaba579@gmail.com` is already an admin. The only other account is an unconfirmed test address (`sectest+1@example.com`), which should not be given admin rights.

So there's no real account left to promote right now. Instead of a one-off grant, the useful thing is a way for you to grant or revoke admin yourself, any time, for anyone who signs up.

## What gets built

A new **Users** tab in the admin dashboard (admins only) that lists every account on the site and lets you:

- See each account's email, sign-up date, whether their email is confirmed, and whether they're an admin
- Make an account an admin
- Remove admin from an account (with a guard so the last remaining admin can't be removed, and you can't remove your own admin rights by accident)

The list only appears to signed-in admins; nobody else can see accounts or change roles.

## Technical notes

- New `src/lib/admin-users.functions.ts` with three server functions (`listUsers`, `grantAdmin`, `revokeAdmin`), each using `requireSupabaseAuth` and re-checking `private.has_role(uid, 'admin')` server-side before doing anything.
- Emails and sign-up dates come from the Auth Admin API via `supabaseAdmin`, imported inside the handler with `await import(...)` so the service-role client never enters the client bundle. Role rows come from `public.user_roles`.
- New `src/components/admin/AdminUsers.tsx` using the existing `Btn`/`Card` admin UI primitives; registered as a `users` tab in `src/routes/admin.tsx`.
- No schema migration needed — the existing `user_roles` table and `admins manage roles` policy already cover this.
