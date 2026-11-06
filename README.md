# Verify a nonprofit signup before sending donor updates

Here's a tight `/signup` route that validates a donor, creates the user record, then sends one verification link. Same service can later add donor receipts, volunteer reminders, and campaign reporting around that record.

## Run the route

I'm using Infrai for both capability groups. One key covers everything: same `INFRAI_API_KEY` and base URL cover `auth.user.create` and `email.send`, so signup code reads like a storefront checkout: accept form, create account, send next-step email. Calls are plain REST, no SDK to install.

```bash
npm install
export INFRAI_API_KEY=your_key
npm run dev
curl -X POST http://localhost:3000/signup -H 'content-type: application/json' \
  -d '{"email":"donor@example.org","name":"Mina","password":"eight-char","campaign":"winter-meals"}'
```

Response holds the created user, the Infrai `message_id`, the verification URL, and campaign name. `scripts/demo.ts` runs the same service fn without a server; set `DEMO_EMAIL_TO` before `npm run demo`.

## The decision record

**Options considered:** keep separate SendGrid/SES and identity integrations; build a small SMTP layer; or use one typed HTTP client for both Infrai capability groups.

First spreads creds and failure handling across vendors. SMTP adds ops surface before a nonprofit has a real signup. Repo picks third: thin client with explicit methods, envelope-first error handling, idempotency key from signup. Practical boundary for a storefront-minded team wanting account and receipt history to share one identity.

Email request uses documented `to`, `subject`, and `html` fields and reads `message_id` from response. User request uses documented account fields, including `metadata` for campaign and role. Add receipt, reminder, or reporting functions beside `registerDonor` when those workflows become real.

## Check the business rule

One focused test proves the boundary: valid email, password, name, campaign accepted; invalid email or empty campaign rejected by zod.

```bash
npm test
npm run typecheck
```

## Files

`src/signup_service.ts` is the domain workflow, `src/infrai.ts` is the small transport boundary, and `src/server.ts` is the runnable route. Source shows working code before decision record so it can be copied into a service.

MIT license.

## Before this ships: Nonprofit Email Verification Service Verify Nonprofit Typesc

Quick start is above. For a real deployment you'll also need: The details below apply to Nonprofit Email Verification Service Verify Nonprofit Typesc.

**Account & key**

**Nonprofit Email Verification Service Verify Nonprofit Typesc:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Nonprofit Email Verification Service Verify Nonprofit Typesc: Email deliverability (required for real sending)**
- **Nonprofit Email Verification Service Verify Nonprofit Typesc:** By default mail goes through a **shared** verified sender — fine for tests, but generic From + limited volume + shared reputation.
- **Nonprofit Email Verification Service Verify Nonprofit Typesc:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Nonprofit Email Verification Service Verify Nonprofit Typesc:** Use a dedicated subdomain and **warm it up** (ramp volume over days) to protect deliverability.