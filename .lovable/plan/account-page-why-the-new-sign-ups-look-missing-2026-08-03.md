# Account page + why the new sign-ups look missing

## What the records actually show

Every account on the site signed up with **email and password**. There are no Apple or Google identities in Auth at all — social sign-in has never been enabled on this site, so an Apple sign-in could not have created an account here.

The 4 accounts that exist:

| Email | Signed up | Email confirmed | Last sign-in |
| --- | --- | --- | --- |
| tumeloledwaba579@gmail.com | 24 May | Yes | 2 Aug |
| sectest+1@example.com | 2 Aug | No | Never |
| manamerican23@gmail.com | 2 Aug | No | Never |
| dineodledwaba@gmail.com | 2 Aug | No | Never |

The two real accounts from 2 Aug do exist in the database — so "never signed in" is accurate: they created an account but never confirmed the email, so Auth has no sign-in for them. Whether the Users tab is failing to display them still needs checking against the live page rather than assumed.

There is also a real broken link: the header sends non-admin signed-in users to `/account`, but no such route exists.

## What gets built

**1. Account page (`/account`)**

A simple page any signed-in user can reach from the header's "Account" button, showing:

- Email address, and whether it's confirmed
- Phone number (if set)
- Sign-in method (email / Apple / Google)
- Date joined and last sign-in
- Sign out

Editable: phone number and display name, saved to their own account. Email stays read-only for now (changing it needs a confirmation flow).

**2. Users tab check and fix**

Load the admin Users tab live and compare it against the 4 accounts above. If rows are missing, fix that cause; if they are all present, make the unconfirmed state read clearly ("Signed up, email not confirmed") and add a "Resend confirmation email" action per account so you can get them in.

## Open question

Do you want Apple/Google sign-in actually enabled on the site? It isn't today. If yes, that's a separate addition and I'd add it alongside email login on the sign-in page.

## Technical notes

- New public-facing route `src/routes/account.tsx`, gated client-side on the existing `useAuth` hook, redirecting to `/login` when signed out.
- Profile fields (display name, phone) stored in user metadata via `supabase.auth.updateUser` — no new table needed for this small set.
- Users-tab work stays in `src/lib/admin-users.functions.ts` and `src/components/admin/AdminUsers.tsx`; resend uses the Auth admin API behind the existing admin guard.
- Route gets its own head() metadata with `noindex`.
