import { NextResponse } from "next/server";

/**
 * Route server-side satu pintu untuk memanggil salah satu dari TIGA
 * Agent AI: Claude (Anthropic), Gemini (Google), atau ChatGPT (OpenAI).
 *
 * Token API rahasia HANYA hidup di sini:
 * - `process.env.<PROVIDER>_API_KEY` (disetel lewat `.env.local`, lihat
 *   `.env.example`), ATAU
 * - token milik pemain sendiri, dikirim per-request lewat header
 *   `x-ai-api-key` (disimpan pemain di IndexedDB lokal lewat panel
 *   Pengaturan Agent AI — lib/ai/apiKeyStore.ts — TIDAK PERNAH disimpan
 *   di server, TIDAK PERNAH ikut export save).
 *
 * Route ini TIDAK PERNAH mengembalikan token API ke client, hanya teks
 * hasil generate model.
 */

const MAX_TOKENS = 1500;

type SupportedProvider = "anthropic" | "openai" | "google";
const SUPPORTED_PROVIDERS: SupportedProvider[] = ["anthropic", "openai", "google"];

const DEFAULT_MODELS: Record<SupportedProvider, string> = {
  anthropic: "claude-sonnet-5",
  openai: "gpt-5",
  google: "gemini-2.5-flash",
};

const ENV_KEY_NAMES: Record<SupportedProvider, string> = {
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
  google: "GOOGLE_API_KEY",
};

const ENV_MODEL_NAMES: Record<SupportedProvider, string> = {
  anthropic: "ANTHROPIC_MODEL",
  openai: "OPENAI_MODEL",
  google: "GOOGLE_MODEL",
};

const AGENT_LABELS: Record<SupportedProvider, string> = {
  anthropic: "Claude",
  openai: "ChatGPT",
  google: "Gemini",
};

export async function POST(request: Request) {
  let body: { providerId?: unknown; systemPrompt?: unknown; userPrompt?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body request bukan JSON valid." }, { status: 400 });
  }

  const { providerId, systemPrompt, userPrompt } = body;
  if (
    typeof providerId !== "string" ||
    !SUPPORTED_PROVIDERS.includes(providerId as SupportedProvider) ||
    typeof systemPrompt !== "string" ||
    typeof userPrompt !== "string" ||
    !userPrompt.trim()
  ) {
    return NextResponse.json(
      { error: "providerId, systemPrompt, dan userPrompt wajib diisi dengan benar." },
      { status: 400 }
    );
  }
  const provider = providerId as SupportedProvider;

  const apiKey = request.headers.get("x-ai-api-key") || process.env[ENV_KEY_NAMES[provider]];
  if (!apiKey) {
    return NextResponse.json(
      {
        error: `Agent ${AGENT_LABELS[provider]} belum dikonfigurasi. Atur ${ENV_KEY_NAMES[provider]} di .env.local, atau isi token API kamu sendiri di panel Pengaturan Agent AI.`,
      },
      { status: 400 }
    );
  }

  const model = process.env[ENV_MODEL_NAMES[provider]] || DEFAULT_MODELS[provider];

  try {
    const text =
      provider === "anthropic"
        ? await callAnthropic(apiKey, model, systemPrompt, userPrompt)
        : provider === "openai"
          ? await callOpenAI(apiKey, model, systemPrompt, userPrompt)
          : await callGoogle(apiKey, model, systemPrompt, userPrompt);

    if (!text) {
      return NextResponse.json(
        { error: `Agent ${AGENT_LABELS[provider]} tidak mengembalikan teks.` },
        { status: 502 }
      );
    }
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : `Permintaan ke Agent ${AGENT_LABELS[provider]} gagal.`;
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

interface AnthropicContentBlock {
  type: string;
  text?: string;
}

async function callAnthropic(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    content?: AnthropicContentBlock[];
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(data.error?.message || `Anthropic API mengembalikan status ${res.status}.`);
  }

  return (data.content ?? [])
    .filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

async function callOpenAI(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(data.error?.message || `OpenAI API mengembalikan status ${res.status}.`);
  }

  const text = data.choices?.[0]?.message?.content;
  return typeof text === "string" ? text.trim() : "";
}

async function callGoogle(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: MAX_TOKENS },
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(data.error?.message || `Google API mengembalikan status ${res.status}.`);
  }

  const parts = data.candidates?.[0]?.content?.parts ?? [];
  return parts
    .map((p) => p.text ?? "")
    .join("\n")
    .trim();
}
