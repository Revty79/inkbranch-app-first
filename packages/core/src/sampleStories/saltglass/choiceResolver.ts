import type { ChoiceRisk } from "@inkbranch/types";
import type { ResolvedStoryChoice, SceneBeat, StoryChoiceEffect, StoryIntentKey } from "../types";
import { saltglassChoiceRules } from "./choiceRules";
import { saltglassEndings } from "./endings";
import { saltglassSceneBeats } from "./sceneBeats";

interface ResolveSaltglassChoiceInput {
  run: {
    currentSceneId: string;
    selectedChoiceIds: string[];
  };
  choiceId?: string;
  customChoiceText?: string;
}

function getBeat(beatId: string): SceneBeat {
  return saltglassSceneBeats.find((beat) => beat.id === beatId) ?? saltglassSceneBeats[0];
}

function getDestination(nextBeatId: string): { locationId: string; completedEndingId?: string } {
  const nextBeat = saltglassSceneBeats.find((beat) => beat.id === nextBeatId);

  if (nextBeat) {
    return {
      locationId: nextBeat.locationId
    };
  }

  const ending = saltglassEndings.find((candidate) => candidate.id === nextBeatId);

  return {
    locationId: ending?.locationId ?? "loc-saltglass-harbor",
    completedEndingId: ending?.id
  };
}

function publicChoiceId(beat: SceneBeat, choiceId: string): string {
  return `${beat.id}::${choiceId}`;
}

function getInternalChoiceId(choiceId: string): string {
  return choiceId.includes("::") ? choiceId.split("::")[1] : choiceId;
}

function mergeEffects(base: StoryChoiceEffect, extra: StoryChoiceEffect): StoryChoiceEffect {
  return {
    setFlags: {
      ...base.setFlags,
      ...extra.setFlags
    },
    relationshipDeltas: {
      ...base.relationshipDeltas,
      ...extra.relationshipDeltas
    },
    dangerDelta: (base.dangerDelta ?? 0) + (extra.dangerDelta ?? 0),
    discoveries: [...(base.discoveries ?? []), ...(extra.discoveries ?? [])],
    canonFacts: [...(base.canonFacts ?? []), ...(extra.canonFacts ?? [])],
    characterUpdates: [...(base.characterUpdates ?? []), ...(extra.characterUpdates ?? [])],
    locationUpdates: [...(base.locationUpdates ?? []), ...(extra.locationUpdates ?? [])],
    warnings: [...(base.warnings ?? []), ...(extra.warnings ?? [])],
    memory: [base.memory, extra.memory].filter(Boolean).join(" "),
    endingDirection: extra.endingDirection ?? base.endingDirection
  };
}

function textHasAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function interpretCustomIntent(text: string): StoryIntentKey {
  const normalizedText = text.toLowerCase();
  const dangerousRule = saltglassChoiceRules.find((rule) => rule.intent === "dangerous");

  if (dangerousRule && textHasAny(normalizedText, dangerousRule.keywords)) {
    return "dangerous";
  }

  return (
    saltglassChoiceRules.find((rule) => textHasAny(normalizedText, rule.keywords))?.intent ??
    "investigation"
  );
}

function buildCustomEffect(beat: SceneBeat, intentKey: StoryIntentKey, originalText: string): Pick<
  ResolvedStoryChoice,
  "effects" | "resolution"
> {
  const normalizedText = originalText.toLowerCase();
  const baseEffect: StoryChoiceEffect = {
    canonFacts: [`Mara tried a custom action: ${originalText}`],
    memory: `Mara chose her own path: ${originalText}`
  };

  if (
    intentKey === "dangerous" &&
    (normalizedText.includes("burn") ||
      normalizedText.includes("destroy") ||
      normalizedText.includes("tear") ||
      normalizedText.includes("throw"))
  ) {
    return {
      effects: mergeEffects(baseEffect, {
        setFlags: { letterDamaged: true, alertedLighthouseGuard: true },
        relationshipDeltas: { "char-orrin-tyde": -1, "char-sister-elan": -1 },
        dangerDelta: 2,
        canonFacts: ["The black seal resisted destruction.", "The letter was damaged but not destroyed."],
        warnings: ["The flame gutters blue against the wax. The seal will not burn."],
        memory: "The engine adapted a destructive action so the letter survived inside canon."
      }),
      resolution: {
        type: "custom",
        originalText,
        interpretedIntent: "dangerous/disruptive",
        canonValidity: "adapted",
        notes: ["The letter cannot be destroyed before an ending, so the action damaged it and raised danger."]
      }
    };
  }

  if (
    intentKey === "retreat" &&
    (normalizedText.includes("forever") || normalizedText.includes("abandon") || normalizedText.includes("quit"))
  ) {
    return {
      effects: mergeEffects(baseEffect, {
        setFlags: { alertedLighthouseGuard: true },
        dangerDelta: 1,
        canonFacts: ["Saltglass prevented Mara from abandoning the unresolved letter."],
        warnings: ["Every road out of Saltglass bends back toward the black seal."],
        memory: "The engine blocked a story-breaking abandonment and kept the run inside canon."
      }),
      resolution: {
        type: "custom",
        originalText,
        interpretedIntent: "retreat/abandon",
        canonValidity: "blocked",
        notes: ["Mara can retreat tactically, but she cannot abandon the letter before the story resolves."]
      }
    };
  }

  const intentEffects: Record<StoryIntentKey, StoryChoiceEffect> = {
    stealth: {
      setFlags: { avoidedWatch: true, followedLanternPath: true },
      dangerDelta: -1,
      canonFacts: ["Mara chose stealth to keep the letter moving."],
      memory: "Custom stealth intent lowered immediate pressure."
    },
    social: {
      setFlags: beat.characterIds.includes("char-orrin-tyde")
        ? { trustsOrrin: true, alliedWithArchivist: true }
        : {},
      relationshipDeltas: beat.characterIds.includes("char-orrin-tyde")
        ? { "char-orrin-tyde": 1 }
        : { "char-captain-maudrin": 1 },
      canonFacts: ["Mara used conversation to shape the next move."],
      memory: "Custom social intent changed a relationship."
    },
    investigation: {
      setFlags: {
        inspectedSeal: true,
        letterOpened: normalizedText.includes("open") || normalizedText.includes("read")
      },
      discoveries: ["Mara found a new angle on the black-sealed letter."],
      dangerDelta: normalizedText.includes("open") || normalizedText.includes("read") ? 1 : 0,
      canonFacts: ["Mara investigated the letter's mystery."],
      memory: "Custom investigation intent created a discovery."
    },
    retreat: {
      setFlags: { avoidedWatch: true },
      canonFacts: ["Mara retreated without abandoning the letter."],
      memory: "Custom retreat intent changed position without breaking the spine."
    },
    dangerous: {
      setFlags: { alertedLighthouseGuard: true },
      relationshipDeltas: { "char-captain-maudrin": -1 },
      dangerDelta: 2,
      canonFacts: ["Mara escalated the danger around the letter."],
      warnings: ["A forceful custom action drew attention."],
      memory: "Custom dangerous intent raised the run danger."
    },
    protect: {
      setFlags: { alliedWithArchivist: true },
      relationshipDeltas: { "char-orrin-tyde": 1 },
      canonFacts: ["Mara protected the proof around the letter."],
      memory: "Custom protect intent strengthened the proof path."
    },
    reveal: {
      setFlags: { exposedCouncilSecret: true },
      dangerDelta: 1,
      canonFacts: ["Mara pushed the council secret toward public exposure."],
      memory: "Custom reveal intent moved toward public truth."
    },
    resolve: {
      canonFacts: ["Mara tried to resolve the letter's place in Saltglass canon."],
      memory: "Custom resolve intent moved toward an ending direction."
    }
  };

  return {
    effects: mergeEffects(baseEffect, intentEffects[intentKey]),
    resolution: {
      type: "custom",
      originalText,
      interpretedIntent: intentKey,
      canonValidity: "valid",
      notes: ["The custom action was interpreted by keyword and routed through the story pack."]
    }
  };
}

export function resolveSaltglassChoice(input: ResolveSaltglassChoiceInput): ResolvedStoryChoice | undefined {
  const beat = getBeat(input.run.currentSceneId);

  if (input.choiceId) {
    const internalChoiceId = getInternalChoiceId(input.choiceId);
    const choice = beat.choices.find((candidate) => candidate.id === internalChoiceId);

    if (!choice) {
      return undefined;
    }

    const destination = getDestination(choice.nextBeatId);

    return {
      choiceId: publicChoiceId(beat, choice.id),
      label: choice.label,
      intent: choice.intent,
      intentKey: choice.intentKey,
      risk: choice.risk,
      nextBeatId: choice.nextBeatId,
      nextLocationId: destination.locationId,
      completedEndingId: destination.completedEndingId,
      effects: choice.effects,
      resolution: {
        type: "preset",
        interpretedIntent: choice.intentKey,
        canonValidity: "valid",
        notes: ["Preset choice came from the current scene beat."]
      }
    };
  }

  const originalText = input.customChoiceText?.replace(/\s+/g, " ").trim();

  if (!originalText) {
    return undefined;
  }

  const intentKey = interpretCustomIntent(originalText);
  const nextBeatId = beat.customRoutes[intentKey] ?? beat.defaultNextBeatId;
  const destination = getDestination(nextBeatId);
  const { effects, resolution } = buildCustomEffect(beat, intentKey, originalText);
  const label = originalText.length > 72 ? `${originalText.slice(0, 69)}...` : originalText;
  const risk: ChoiceRisk = resolution.canonValidity === "blocked" ? "medium" : intentKey === "dangerous" ? "high" : "medium";

  return {
    choiceId: `custom-${beat.id}-${input.run.selectedChoiceIds.length + 1}`,
    label,
    intent: originalText,
    intentKey,
    risk,
    nextBeatId,
    nextLocationId: destination.locationId,
    completedEndingId: destination.completedEndingId,
    effects,
    resolution
  };
}
