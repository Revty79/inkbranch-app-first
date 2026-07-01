import type { Character } from "@inkbranch/types";

export const saltglassCharacters: Character[] = [
  {
    id: "char-mara-vell",
    name: "Mara Vell",
    role: "Courier carrying the black-sealed letter",
    traits: ["watchful", "stubborn", "quietly brave"],
    goals: ["deliver the letter", "learn why her family name was erased", "survive Saltglass before dawn"]
  },
  {
    id: "char-orrin-tyde",
    name: "Orrin Tyde",
    role: "Harbor archivist with keys to the tide ledger",
    traits: ["precise", "wry", "protective when cornered"],
    goals: ["protect the archive", "prove the council altered the succession records"]
  },
  {
    id: "char-sister-elan",
    name: "Sister Elan",
    role: "Keeper of the lantern path",
    traits: ["severe", "devout", "secretly merciful"],
    goals: ["keep the lighthouse mirrors lit", "stop the Tallow Prince from claiming the city"]
  },
  {
    id: "char-captain-maudrin",
    name: "Captain Maudrin",
    role: "Commander of the lighthouse guard",
    traits: ["formal", "suspicious", "bound by public law"],
    goals: ["seize the letter", "avoid a riot in the harbor district"]
  }
];
