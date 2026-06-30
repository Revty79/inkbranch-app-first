import type { ScenePackage } from "@inkbranch/types";

export function buildScenePrompt(input: ScenePackage): string {
  const canon = input.canonRules.map((rule) => `- ${rule.statement}`).join("\n");
  const required = input.requiredEvents.map((event) => `- ${event.description}`).join("\n");
  const readerCanon = input.readerCanon.map((fact) => `- ${fact}`).join("\n");

  return [
    `Book: ${input.book.title}`,
    `Chapter: ${input.chapterNumber}`,
    `Viewpoint: ${input.viewpoint.characterId}`,
    "Canon rules:",
    canon,
    "Required events:",
    required || "- None remaining in this scene package.",
    "Reader canon:",
    readerCanon || "- No reader-specific canon yet.",
    `Return exactly ${input.constraints.choiceCount} choices.`
  ].join("\n");
}
