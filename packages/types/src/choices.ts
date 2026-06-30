export type ChoiceRisk = "low" | "medium" | "high";

export interface Choice {
  id: string;
  label: string;
  intent: string;
  risk: ChoiceRisk;
}
