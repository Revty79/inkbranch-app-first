import type { CanonRule } from "@inkbranch/types";

export const saltglassCanonRules: CanonRule[] = [
  {
    id: "canon-letter-survives",
    statement: "The black-sealed letter cannot be fully destroyed before an ending.",
    severity: "law"
  },
  {
    id: "canon-mara-protagonist",
    statement: "Mara Vell remains the primary viewpoint and driver of the run.",
    severity: "law"
  },
  {
    id: "canon-seal-reacts",
    statement: "The black seal reacts to fire, saltwater, and lighthouse mirrors.",
    severity: "law"
  },
  {
    id: "canon-council-secret",
    statement: "The council erased a lawful heir from the tide ledger.",
    severity: "law"
  },
  {
    id: "canon-drowned-scribe",
    statement: "The letter was written by a scribe officially declared drowned.",
    severity: "law"
  },
  {
    id: "canon-orrin-keys",
    statement: "Orrin Tyde can open archive locks but cannot command the lighthouse guard.",
    severity: "guideline"
  },
  {
    id: "canon-guard-law",
    statement: "Captain Maudrin follows public law even when he suspects private corruption.",
    severity: "guideline"
  },
  {
    id: "canon-no-chatbot",
    statement: "Scenes must render consequences inside the authored mystery rather than ask the reader what the story is about.",
    severity: "law"
  }
];
