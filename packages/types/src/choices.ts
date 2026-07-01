export type ChoiceRisk = "low" | "medium" | "high";
export type CanonValidity = "valid" | "adapted" | "blocked";

export type ReaderChoiceInput =
  | {
      type: "preset";
      choiceId: string;
    }
  | {
      type: "custom";
      text: string;
    };

export interface ReaderChoiceResolution {
  type: "preset" | "custom";
  originalText?: string;
  interpretedIntent: string;
  canonValidity: CanonValidity;
  notes: string[];
}

export interface Choice {
  id: string;
  label: string;
  intent: string;
  risk: ChoiceRisk;
  metadata?: Record<string, string | number | boolean>;
}
