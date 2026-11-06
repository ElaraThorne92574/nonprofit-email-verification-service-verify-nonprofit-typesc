import { z } from "zod";
import { infrai } from "./infrai.js";

export const signupSchema = z.object({ email: z.string().email(), name: z.string().min(1), password: z.string().min(8), campaign: z.string().min(1) });
export type Signup = z.infer<typeof signupSchema>;

export async function registerDonor(input: unknown) {
  const signup = signupSchema.parse(input);
  const key = `donor-${signup.email.toLowerCase()}-${signup.campaign}`;
  const user = await infrai.auth.user.create({ email: signup.email, password: signup.password, name: signup.name, metadata: { campaign: signup.campaign, role: "donor" }, vendor: "default", mode: "default_vendor", idempotency_key: key }, key);
  const verificationUrl = `https://nonprofit.example/verify?email=${encodeURIComponent(signup.email)}`;
  const email = await infrai.email.send({ to: signup.email, subject: "Verify your nonprofit account", html: `<p>Hi ${signup.name},</p><p><a href="${verificationUrl}">Verify your email</a> to finish signing up.</p>` }, key);
  return { user, message_id: (email as { message_id: string }).message_id, verificationUrl, campaign: signup.campaign };
}
