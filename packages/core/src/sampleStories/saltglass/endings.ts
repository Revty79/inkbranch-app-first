import type { StoryEnding } from "../types";

export const saltglassEndings: StoryEnding[] = [
  {
    id: "ending-archivist",
    title: "The Ledger Keeps the City",
    direction: "archivist",
    locationId: "loc-underpier-archive",
    requiredFlags: ["alliedWithArchivist"],
    paragraphs: [
      "Orrin opens the tide ledger with both hands shaking. Mara presses the black seal beside the scraped Vell name, and the page drinks it whole.",
      "By dawn, every lawful copy of the ledger has rewritten itself around the erased line. The council survives the morning, but only as defendants in its own records.",
      "Mara leaves Saltglass with ink on her fingers and the knowledge that quiet proof can outlast a louder lie."
    ],
    canonFacts: ["The letter became part of the tide ledger.", "The archive ending preserved the Vell proof."]
  },
  {
    id: "ending-revolt",
    title: "The Bell That Would Not Stop",
    direction: "revolt",
    locationId: "loc-lighthouse-mirror-room",
    requiredFlags: ["exposedCouncilSecret"],
    paragraphs: [
      "The bell rope burns blue under Mara's hand. One bell answers, then six, then every mirror in Saltglass throws Iven Rook's accusation into the streets.",
      "The council orders silence, but its own windows repeat the proof. Captain Maudrin lowers his sword first. The crowd does not lower its voice.",
      "Mara is not crowned, forgiven, or safe. But the city knows who lied, and some truths become doors once enough people push."
    ],
    canonFacts: ["The city heard the council secret.", "The bell ending made the proof public."]
  },
  {
    id: "ending-exile",
    title: "The Black Boat",
    direction: "exile",
    locationId: "loc-saltglass-harbor",
    paragraphs: [
      "The black boat waits under the Tide Bridge with no oarsman and no lantern. Mara steps in with the letter still sealed against her palm.",
      "Behind her, Saltglass argues with its mirrors. Ahead, the tide carries the proof toward cities the council cannot command.",
      "The letter remains dangerous because it remains free, and Mara Vell becomes the courier every harbor law learns to fear."
    ],
    canonFacts: ["Mara carried the letter beyond Saltglass.", "The exile ending kept the proof in motion."]
  }
];
