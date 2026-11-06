import { registerDonor } from "../src/signup_service.js";
const email = process.env.DEMO_EMAIL_TO;
if (!email) throw new Error("DEMO_EMAIL_TO is required");
console.log(await registerDonor({ email, name: "Jordan", password: "correct-horse", campaign: "spring-food-drive" }));
