# Missing account in the Users tab

## What the database actually shows

There are 4 accounts on the site right now:

| Email | Signed up | Email confirmed | Last sign-in |
| --- | --- | --- | --- |
| tumeloledwaba579@gmail.com | 24 May | Yes | 2 Aug |
| sectest+1@example.com | 2 Aug | No | Never |
| manamerican23@gmail.com | 2 Aug | No | Never |
| dineodledwaba@gmail.com | 2 Aug | No | Never |

Two real new accounts were created yesterday (2 Aug). Neither has ever completed a sign-in, and neither has confirmed their email — Auth has no sign-in record for them, so "signed in yesterday" was most likely a sign-up that stopped at the confirmation email.

The Users tab is built to list every account regardless of confirmation, so those rows should already be visible. I have not yet confirmed what the tab actually renders, so the first step is to check that rather than guess.

## Plan

1. Load the admin Users tab in the live preview while signed in as the admin and compare what it renders against the 4 accounts above. Capture any error the accounts request returns.
2. If the rows are missing, fix the cause found in step 1 (most likely candidates: the accounts request erroring and the table keeping stale data, or the published site running an older build than the preview).
3. If all 4 rows are already present, the account is there — it just hasn't confirmed its email. In that case make that state obvious in the tab: show "Unconfirmed — hasn't signed in yet" clearly, and add a "Resend confirmation email" action per unconfirmed account so you can get them through the door.

## Technical notes

- Verification uses Playwright against the preview with the injected admin session, reading the `listUsers` response and any console error.
- Any fix stays in `src/lib/admin-users.functions.ts` and `src/components/admin/AdminUsers.tsx`; the resend action would be a new admin-guarded server function using the Auth admin API.
- No schema migration is expected.
