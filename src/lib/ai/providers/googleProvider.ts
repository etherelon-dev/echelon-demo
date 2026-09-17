import type { AIGenerateInput, AIProvider } from "./types";
import { callAIRoute } from "./serverRouteClient";

export const googleProvider: AIProvider = {
  id: "google",
  label: "Gemini (Google)",
  generateAction(input: AIGenerateInput): Promise<string> {
    return callAIRoute("google", input);
  },
};
