import type { AIGenerateInput, AIProvider } from "./types";
import { callAIRoute } from "./serverRouteClient";

export const openaiProvider: AIProvider = {
  id: "openai",
  label: "ChatGPT (OpenAI)",
  generateAction(input: AIGenerateInput): Promise<string> {
    return callAIRoute("openai", input);
  },
};
