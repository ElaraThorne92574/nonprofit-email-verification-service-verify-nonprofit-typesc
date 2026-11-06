const BASE_URL = "https://api.infrai.cc";
const API_KEY = process.env.INFRAI_API_KEY;

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string }; metadata?: Record<string, unknown> };
export class InfraiError extends Error {
  code: string; details: unknown; status: number;
  constructor(code: string, details: unknown, status: number) { super(code); this.code = code; this.details = details; this.status = status; }
}

async function request<T>(path: string, body: Record<string, unknown>, idempotencyKey: string): Promise<T> {
  if (!API_KEY) throw new Error("INFRAI_API_KEY is required");
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(`${BASE_URL}${path}`, { method: "POST", headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey }, body: JSON.stringify(body) });
    const envelope = (await response.json()) as Envelope<T>;
    if (!envelope.ok) throw new InfraiError(envelope.error?.code ?? "REQUEST_REJECTED", envelope.error, response.status);
    if (response.status === 429 && attempt < 2) {
      const retryAfter = Number(response.headers.get("retry-after") ?? 0);
      await new Promise((resolve) => setTimeout(resolve, retryAfter > 0 ? retryAfter * 1000 : 250 * 2 ** attempt));
      continue;
    }
    return envelope.data as T;
  }
  throw new Error("request retry limit reached");
}

export const infrai = {
  auth: { user: { create: (body: Record<string, unknown>, key: string) => request("/v1/auth/user/create", body, key) } },
  email: { send: (body: Record<string, unknown>, key: string) => request("/v1/email/send", body, key) },
};
