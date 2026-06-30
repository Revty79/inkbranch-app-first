import type { ChoiceRisk, SceneResult } from "@inkbranch/types";

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface SceneValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

const allowedRisks: ChoiceRisk[] = ["low", "medium", "high"];
const stateChangeKeys = ["characterUpdates", "locationUpdates", "canonFacts", "warnings"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateSceneResult(sceneResult: unknown): SceneValidationResult {
  const issues: ValidationIssue[] = [];

  if (!isRecord(sceneResult)) {
    return {
      valid: false,
      issues: [{ path: "scene", message: "Scene result must be an object." }]
    };
  }

  if (!hasText(sceneResult.chapterTitle)) {
    issues.push({ path: "chapterTitle", message: "Chapter title is required." });
  }

  if (!hasText(sceneResult.sceneText)) {
    issues.push({ path: "sceneText", message: "Scene text is required." });
  }

  if (!Array.isArray(sceneResult.choices)) {
    issues.push({ path: "choices", message: "Choices must be an array." });
  } else {
    if (sceneResult.choices.length !== 3) {
      issues.push({ path: "choices", message: "Exactly 3 choices are required." });
    }

    sceneResult.choices.forEach((choice, index) => {
      if (!isRecord(choice)) {
        issues.push({ path: `choices.${index}`, message: "Choice must be an object." });
        return;
      }

      if (!hasText(choice.id)) {
        issues.push({ path: `choices.${index}.id`, message: "Choice id is required." });
      }

      if (!hasText(choice.label)) {
        issues.push({ path: `choices.${index}.label`, message: "Choice label is required." });
      }

      if (!hasText(choice.intent)) {
        issues.push({ path: `choices.${index}.intent`, message: "Choice intent is required." });
      }

      if (!hasText(choice.risk) || !allowedRisks.includes(choice.risk as ChoiceRisk)) {
        issues.push({ path: `choices.${index}.risk`, message: "Choice risk must be low, medium, or high." });
      }
    });
  }

  const stateChanges = sceneResult.stateChanges;

  if (!isRecord(stateChanges)) {
    issues.push({ path: "stateChanges", message: "State changes must be an object." });
  } else {
    stateChangeKeys.forEach((key) => {
      if (!Array.isArray(stateChanges[key])) {
        issues.push({ path: `stateChanges.${key}`, message: `${key} must be an array.` });
      }
    });
  }

  if (!hasText(sceneResult.memoryUpdate)) {
    issues.push({ path: "memoryUpdate", message: "Memory update is required." });
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

export function assertValidSceneResult(sceneResult: unknown): asserts sceneResult is SceneResult {
  const validation = validateSceneResult(sceneResult);

  if (!validation.valid) {
    const details = validation.issues.map((issue) => `${issue.path}: ${issue.message}`).join("; ");
    throw new Error(`Invalid scene result. ${details}`);
  }
}
