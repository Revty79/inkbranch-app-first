import type { ChoiceRule } from "../types";

export const saltglassChoiceRules: ChoiceRule[] = [
  {
    intent: "stealth",
    keywords: ["hide", "sneak", "avoid", "slip", "quiet", "shadow", "mask"],
    description: "Avoid attention, bypass watch pressure, or move through hidden paths."
  },
  {
    intent: "social",
    keywords: ["ask", "talk", "trust", "tell", "persuade", "bargain", "confess"],
    description: "Use conversation, trust, leverage, or a character relationship."
  },
  {
    intent: "investigation",
    keywords: ["open", "read", "inspect", "study", "search", "look", "copy"],
    description: "Seek information in the letter, seal, ledger, or scene details."
  },
  {
    intent: "retreat",
    keywords: ["run", "escape", "leave", "flee", "retreat", "boat", "back"],
    description: "Reduce immediate pressure or move away from the current confrontation."
  },
  {
    intent: "dangerous",
    keywords: ["burn", "destroy", "attack", "fight", "break", "throw", "tear"],
    description: "Attempt force, damage, violence, or story-breaking disruption."
  },
  {
    intent: "protect",
    keywords: ["protect", "shield", "save", "cover", "guard"],
    description: "Protect a person, proof, or fragile piece of canon."
  },
  {
    intent: "reveal",
    keywords: ["expose", "announce", "reveal", "accuse", "publish", "ring"],
    description: "Make the council secret public."
  },
  {
    intent: "resolve",
    keywords: ["seal", "commit", "decide", "finish", "deliver", "record"],
    description: "Move toward a final ending direction."
  }
];
