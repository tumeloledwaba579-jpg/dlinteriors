# Lessons learned — patterns to spot in any future project

This isn't a changelog (that's what `PITFALLS.md` / `SECURITY-AUDIT.md` /
`FRONTEND-AUDIT.md` are for, with every specific bug and its fix). This
is the five *shapes* those ~38 problems kept taking, so you can
recognize the shape on a brand new project before it becomes a bug
someone has to find later. When in doubt while building or reviewing
anything, run down this list.

---

## 1. "It looks broken but nothing errors"

Something fails silently or behaves inconsistently, with no exception,
no red text, no obvious signal that anything is wrong.

**How to spot it:**
- Any `async` function that flips a loading/busy flag and calls an
  external API — does it have `try/catch/finally`? If an error can be
  thrown and there's no `catch`, the UI can get stuck forever with the
  spinner still going and no message. (Real example: OAuth sign-in
  hung indefinitely until a `try/catch` was added.)
- If a fix "doesn't seem to work," the first question is always **"is
  it actually deployed?"** before touching the code again. Pushing to
  GitHub is not the same as being live unless you have CI/CD and you've
  confirmed the run succeeded.
- If behavior doesn't match what the code says it should do, check
  **which environment/project it's actually pointed at** — `.env`
  files, config files (`wrangler.jsonc`, `supabase/config.toml`), and
  dashboard settings can all drift out of sync with each other and with
  what you *think* is configured.

---

## 2. "The UI lies about what's really happening"

A feature looks like it works — a form submits, a page renders content
— but it's not actually wired to the real data source.

**How to spot it:**
- If there's an admin panel/form that edits table X, **open the actual
  public-facing page's source code and confirm it queries table X**.
  A working save button proves the write path works — it proves
  nothing about the read path.
- A "list" view and a "detail" view of the same kind of thing (a
  portfolio grid and a single project page; an accounts list and an
  account's own page) need to be checked **separately**. One working
  doesn't mean the other does.
- Be suspicious of anything that looks *too* complete right after a
  fresh setup — a demo/seed/fallback value can be so plausible-looking
  that it passes as real content for a long time. Search the codebase
  for hardcoded arrays or seed data before trusting what's on screen.
- In particular: **any aggregate/summary figure calculated from rows
  that might not all belong to the current user** needs an explicit
  ownership filter. This was the single most repeated bug in this
  project (5 separate pages) — RLS controlling what you can *see* is
  not the same as what should count toward *your own* totals.

---

## 3. "The security check has a gap"

A permission or ownership rule exists, but there's a way around it —
for a real attacker, or just for another legitimate user doing
something the rule-writer didn't think of.

**How to spot it:**
- When writing or reviewing a row-level-security policy (or any
  permission check), **test it as the attacker**, not just as the
  legitimate user. Actually try the insert/update/delete you shouldn't
  be able to do, inside a transaction you roll back afterward. Reading
  the policy and reasoning "that looks right" is not the same as
  proving it.
- An `UPDATE` policy with a `USING` clause but no explicit `WITH CHECK`
  silently inherits `USING` for the check too — which usually
  describes which rows you can *reach*, not what you're allowed to
  *change them to*. This exact gap caused three different bugs here.
- Fixing one hole can open another one right next to it (closing an
  ownership-forgery gap here caused an infinite-recursion outage
  between two tables). After any permission fix, re-test the
  surrounding behavior, not just the one thing you changed.

---

## 4. "A secret got out"

A real credential — API key, session token, signing key — ends up
somewhere it shouldn't.

**How to spot it / prevent it:**
- Treat any real token, key, or password as **burned the moment it
  touches a chat, a public repo, or a commit history** — rotate or
  revoke it rather than hoping no one saw it. This applies even to
  "example" or template files; a real-looking value in a `.env.example`
  is still a leaked credential if it's actually real.
- Check that `.gitignore` excludes the **real** secrets file, not a
  decoy with a similar name. (`.dev.vars.example` ignored instead of
  `.dev.vars` — the opposite of what you want — sat unnoticed until
  found during an audit.)
- Never paste a full URL containing `access_token=`, `refresh_token=`,
  or similar into anywhere semi-public, including a debugging chat.
  Redact everything after the `#` or `?` first — the path is usually
  all that's needed to diagnose a problem.

---

## 5. "Works for me, breaks for the next case"

Something is correct for the exact data/environment it was built and
tested against, and silently wrong for a different but equally valid
case.

**How to spot it:**
- Any code parsing numbers, dates, or currency from user input or
  imported files should be checked against **more than one regional
  format**. `"1,234.56"` and `"1.234,56"` are both common and mean
  different things — code that assumes one will quietly corrupt the
  other. (A financial import bug like this doesn't error — it just
  produces a wrong number that looks plausible.)
- Anything with a generic default name from a starter template (a
  Cloudflare Worker name, a default project name) **will eventually
  collide** the moment a second project uses the same unmodified
  template. Rename it immediately, don't wait for the collision to
  prove it's a problem.
- If you write documentation that describes what your app does (a
  privacy policy, a README, API docs), **verify it against the actual
  code** — don't describe a feature because you found an API key for
  it sitting in `.env`. An unused credential doesn't mean the feature
  it's named after actually exists.

---

## Quick checklist before treating something as "done"

- [ ] Every `async` action that sets a loading state has a `catch`
- [ ] Confirmed the fix is actually deployed, not just pushed
- [ ] Checked `.env`/config files match what you *think* is configured
- [ ] For any "admin edits X" feature: opened the public page's code
      and confirmed it reads from the same X
- [ ] For any summary/total/aggregate number: confirmed it's scoped to
      what the current user actually owns, not everything they can see
- [ ] For any new permission/RLS policy: tried to break it as an
      attacker, not just read it and assumed it's correct
- [ ] No real secret appears in any file tracked by git — checked
      `.gitignore` covers the actual secrets file, by name, exactly
- [ ] Any number-parsing code tested against more than one regional
      format
- [ ] Any resource name (Worker, project, service) explicitly set, not
      left on a template's default
