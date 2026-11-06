import { test } from "node:test";
import assert from "node:assert/strict";
import { signupSchema } from "../src/signup_service.js";

test("signup requires a real email and a campaign", () => {
  const result = signupSchema.safeParse({ email: "donor@example.org", name: "Mina", password: "eight-char", campaign: "winter-meals" });
  assert.equal(result.success, true);
  assert.equal(signupSchema.safeParse({ email: "bad", name: "Mina", password: "short", campaign: "" }).success, false);
});
