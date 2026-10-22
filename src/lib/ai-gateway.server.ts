import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import fs from "fs";
import path from "path";

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export function createLovableAiGatewayProvider(lovableApiKey: string, initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  let resolveRunId: (value: string | undefined) => void = () => {};
  let runIdResolved = false;
  const runIdReady = new Promise<string | undefined>((resolve) => {
    resolveRunId = resolve;
  });

  const publishRunId = (value?: string) => {
    const nextRunId = value?.trim() || undefined;
    if (!runId && nextRunId) runId = nextRunId;
    if (!runIdResolved) {
      runIdResolved = true;
      resolveRunId(runId);
    }
  };
  if (runId) publishRunId(runId);

  const provider = createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: async (input, init) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) {
        headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
      }
      try {
        const response = await fetch(input, { ...init, headers });
        publishRunId(response.headers.get(LOVABLE_AIG_RUN_ID_HEADER) ?? undefined);
        return response;
      } catch (error) {
        publishRunId(undefined);
        throw error;
      }
    },
  });

  return Object.assign(provider, {
    getRunId: () => runId,
    waitForRunId: () => (runId ? Promise.resolve(runId) : runIdReady),
  });
}

/** Direct Gateway fetch for OpenAI-compatible chat/completions (used for vision JSON). */
export async function gatewayChatCompletion(body: Record<string, unknown>): Promise<unknown> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "lovable-direct",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI Gateway ${res.status}: ${text}`);
  }
  return res.json();
}

/** Helper to dynamically load GEMINI_API_KEY from AI Studio workspace config or environment. */
export function getGeminiApiKey(): string | null {
  const candidateFiles = [
    "/app/.dev.env.json",
    path.join(process.cwd(), ".dev.env.json"),
    path.join(process.cwd(), ".env"),
  ];
  for (const file of candidateFiles) {
    try {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, "utf-8");
        if (file.endsWith(".json")) {
          const parsed = JSON.parse(content);
          if (typeof parsed.GEMINI_API_KEY === "string") {
            const val = parsed.GEMINI_API_KEY.trim();
            if (val && !val.startsWith("MY_GEMINI_") && val !== "your_api_key_here") {
              return val;
            }
          }
        } else {
          // Accept conventional .env spacing as well as a compact assignment.
          // This keeps server-only AI routes working when the key is entered as
          // `GEMINI_API_KEY = "..."` in local project settings.
          const match = content.match(/^\s*GEMINI_API_KEY\s*=\s*(.*)$/m);
          if (match && match[1]) {
            const val = match[1].trim().replace(/^["']|["']$/g, "");
            if (val && !val.startsWith("MY_GEMINI_") && val !== "your_api_key_here") {
              return val;
            }
          }
        }
      }
    } catch {
      // ignore read errors
    }
  }

  const envKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === "string") {
    const val = envKey.trim();
    if (val && !val.startsWith("MY_GEMINI_") && val !== "your_api_key_here") {
      return val;
    }
  }

  return null;
}
