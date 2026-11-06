import { createServer } from "node:http";
import { registerDonor } from "./signup_service.js";
import { ZodError } from "zod";

const server = createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/signup") { res.writeHead(404).end(); return; }
  try {
    const chunks: Buffer[] = []; for await (const chunk of req) chunks.push(Buffer.from(chunk));
    const result = await registerDonor(JSON.parse(Buffer.concat(chunks).toString("utf8")));
    res.writeHead(201, { "content-type": "application/json" }).end(JSON.stringify(result));
  } catch (error) {
    const status = error instanceof ZodError ? 400 : 502;
    res.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify({ error: error instanceof Error ? error.message : "signup failed" }));
  }
});
server.listen(Number(process.env.PORT ?? 3000), () => console.log("signup service listening on http://localhost:3000/signup"));
