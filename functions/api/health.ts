import { MODEL_LABEL } from './_profile';

// GET /api/health: tells the chat whether Workers AI is bound (costs no AI quota).
export const onRequestGet = ({ env }: { env: { AI?: unknown } }) =>
  Response.json({ ok: !!env.AI, model: MODEL_LABEL }, { status: env.AI ? 200 : 503 });
