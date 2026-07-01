import type { ConsequenceFlagDefinition } from "../types";

export const saltglassConsequenceFlags: ConsequenceFlagDefinition[] = [
  {
    id: "inspectedSeal",
    label: "Inspected seal",
    description: "Mara studied the black wax and noticed it behaves like a living tide mark.",
    defaultValue: false
  },
  {
    id: "trustsOrrin",
    label: "Trusts Orrin",
    description: "Mara chose to treat Orrin Tyde as an ally instead of a liability.",
    defaultValue: false
  },
  {
    id: "avoidedWatch",
    label: "Avoided watch",
    description: "Mara slipped past the harbor watch without letting them set the first terms.",
    defaultValue: false
  },
  {
    id: "alertedLighthouseGuard",
    label: "Alerted guard",
    description: "The lighthouse guard knows the black-sealed letter is moving through Saltglass.",
    defaultValue: false
  },
  {
    id: "letterOpened",
    label: "Letter opened",
    description: "The letter has been opened, revealing part of the drowned scribe's accusation.",
    defaultValue: false
  },
  {
    id: "letterDamaged",
    label: "Letter damaged",
    description: "The letter has been scorched, soaked, torn, or otherwise marked by reader action.",
    defaultValue: false
  },
  {
    id: "knowsAboutDrownedScribe",
    label: "Drowned scribe",
    description: "Mara knows the letter was written by a scribe officially recorded as drowned.",
    defaultValue: false
  },
  {
    id: "alliedWithArchivist",
    label: "Archivist ally",
    description: "Orrin has committed his archive keys and reputation to Mara's run.",
    defaultValue: false
  },
  {
    id: "followedLanternPath",
    label: "Lantern path",
    description: "Mara followed the lighthouse service route instead of the public quay.",
    defaultValue: false
  },
  {
    id: "exposedCouncilSecret",
    label: "Council secret",
    description: "Mara has exposed or prepared to expose the council's hidden succession ledger.",
    defaultValue: false
  }
];

export const saltglassInitialFlags = saltglassConsequenceFlags.reduce<Record<string, boolean>>(
  (flags, flag) => ({
    ...flags,
    [flag.id]: flag.defaultValue
  }),
  {}
);
