import type { AIGenerateInput, AIProvider } from "./types";
import { callAIRoute } from "./serverRouteClient";

export const anthropicProvider: AIProvider = {
  id: "anthropic",
  label: "Claude (Anthropic)",
  generateAction(input: AIGenerateInput): Promise<string> {
    return callAIRoute("anthropic", input);
  },
};
