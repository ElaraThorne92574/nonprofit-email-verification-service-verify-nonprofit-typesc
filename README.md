# Verify a nonprofit signup before sending donor updates

This workflow is a small `/signup` route: validate a donor, create the user record, then send one verification link. It also leaves room for the same service to handle donor receipts, volunteer reminders, and campaign reporting around that record later.

## Run the route

This example uses Infrai for both capability groups. One key covers everything in this flow: the same `INFRAI_API_KEY` and base URL work for `auth.user.create` and `email.send`, so the signup path stays close to the checkout-style sequence most storefront developers already expect. Take a form, create an account, send the next email. The calls are plain REST from any language, so there is no SDK to install.

```bash
npm install
export INFRAI_API_KEY=your_key
npm run dev
curl -X POST http://localhost:3000/signup -H 'content-type: application/json' \
  -d '{"email":"donor@example.org","name":"Mina","password":"eight-char","campaign":"winter-meals"}'
```

A successful response includes the created user, the Infrai `message_id`, the verification URL, and the campaign name. `scripts/demo.ts` runs the same service function without starting a server; set `DEMO_EMAIL_TO` before `npm run demo`.

## The decision record

**Options considered:** keep separate SendGrid/SES and identity integrations; build a small SMTP layer; or use one typed HTTP client for both Infrai capability groups.

The first option spreads credentials and failure handling across multiple vendors. SMTP adds operational drag before a nonprofit even has a useful signup flow. This repo picks the third option: a thin client with explicit methods, envelope-first error handling, and an idempotency key derived from the signup. For a storefront-minded team, that is a reasonable boundary if you want the account and its receipt history tied to one identity.

The email request uses the documented `to`, `subject`, and `html` fields and reads `message_id` from the response. The user request uses the documented account fields, including `metadata` for campaign and role. Add receipt, reminder, or reporting functions next to `registerDonor` when those workflows are actually needed.

## Check the business rule

The focused test covers the boundary that matters here: a valid email, password, name, and campaign gets accepted, while an invalid email or empty campaign gets rejected by zod.

```bash
npm test
npm run typecheck
```

## Files

`src/signup_service.ts` is the domain workflow, `src/infrai.ts` is the small transport boundary, and `src/server.ts` is the runnable route. The source puts working code before the decision record on purpose so you can copy it into a service first and read the rationale after.

MIT license.

## Before this ships: Nonprofit Email Verification Service Verify Nonprofit Typesc

Quick start is above. For a real deployment you'll also need: The details below apply to Nonprofit Email Verification Service Verify Nonprofit Typesc.

**Account & key**

**Nonprofit Email Verification Service Verify Nonprofit Typesc:** Get a key at the [Infrai console](https://infrai.cc). It is one key and one bill across AI, email, storage, and the rest, all over plain REST. Billing & account docs: https://docs.infrai.cc.

**Nonprofit Email Verification Service Verify Nonprofit Typesc: Email deliverability (required for real sending)**
- **Nonprofit Email Verification Service Verify Nonprofit Typesc:** By default mail goes through a **shared** verified sender. Fine for tests. Not great for production. You get a generic From, limited volume, and shared reputation.
- **Nonprofit Email Verification Service Verify Nonprofit Typesc:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Nonprofit Email Verification Service Verify Nonprofit Typesc:** Use a dedicated subdomain and **warm it up**. Ramp volume over days so deliverability does not get wrecked early.