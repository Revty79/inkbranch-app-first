import type { SceneBeat } from "../types";

export const saltglassSceneBeats: SceneBeat[] = [
  {
    id: "beat-harbor-stair",
    chapter: 1,
    title: "The Third Stair",
    locationId: "loc-saltglass-harbor",
    summary: "Mara reaches Saltglass Harbor and sees the black seal draw attention.",
    paragraphs: [
      "Mara Vell reaches Saltglass with the letter pressed flat beneath her coat and the harbor bells sleeping above the fog.",
      "At Pier Nine, the third stair gives a hollow knock under her boot. Across the quay, an archivist stops pretending not to look at the black wax.",
      "The seal is not simply dark. It drinks the lamplight and returns a blue glimmer, like tidewater under a closed door."
    ],
    variants: [
      {
        flag: "letterDamaged",
        text: "A scorch mark crosses one edge of the envelope, but the black seal has healed smooth over the wound."
      }
    ],
    characterIds: ["char-mara-vell", "char-orrin-tyde"],
    discovery: "The black seal reacts to harbor light.",
    threat: "Someone has recognized the courier mark.",
    canonFacts: ["The black seal was recognized in Saltglass Harbor."],
    choices: [
      {
        id: "inspect-seal",
        label: "Study the black seal",
        intent: "Inspect the seal before anyone can name it.",
        intentKey: "investigation",
        risk: "low",
        nextBeatId: "beat-mirror-market",
        effects: {
          setFlags: { inspectedSeal: true },
          discoveries: ["The seal drinks lamplight and answers in blue."],
          canonFacts: ["Mara inspected the black seal."],
          memory: "Mara chose observation before trust."
        }
      },
      {
        id: "trust-orrin",
        label: "Let Orrin guide you",
        intent: "Trust the archivist who recognized the wax.",
        intentKey: "social",
        risk: "medium",
        nextBeatId: "beat-archive-door",
        effects: {
          setFlags: { trustsOrrin: true },
          relationshipDeltas: { "char-orrin-tyde": 2 },
          canonFacts: ["Mara accepted Orrin's help at Pier Nine."],
          memory: "Mara gave Orrin a guarded chance."
        }
      },
      {
        id: "take-lantern-path",
        label: "Leave by the lantern path",
        intent: "Avoid the quay and follow the service lamps.",
        intentKey: "stealth",
        risk: "medium",
        nextBeatId: "beat-lantern-walk",
        effects: {
          setFlags: { avoidedWatch: true, followedLanternPath: true },
          dangerDelta: -1,
          canonFacts: ["Mara left the public quay by the Lantern Walk."],
          memory: "Mara chose movement over answers."
        }
      }
    ],
    customRoutes: {
      investigation: "beat-mirror-market",
      social: "beat-archive-door",
      stealth: "beat-lantern-walk",
      retreat: "beat-mirror-market",
      dangerous: "beat-watch-house"
    },
    defaultNextBeatId: "beat-mirror-market"
  },
  {
    id: "beat-mirror-market",
    chapter: 1,
    title: "Mirror Market",
    locationId: "loc-saltglass-harbor",
    summary: "The market turns rumor into proof and pressure.",
    paragraphs: [
      "The mirror market crouches beneath awnings of old sailcloth. Every stall sells a way to watch someone else: polished spoons, brass hand mirrors, glass buttons bright as eyes.",
      "A bell seller sees the black wax and covers his mouth. He whispers that the same seal was found on a dead scribe's tongue after the winter dredging.",
      "Behind Mara, two lighthouse guards begin asking which courier came in on the evening tide."
    ],
    variants: [
      {
        flag: "inspectedSeal",
        text: "Because Mara studied the wax, she notices the market mirrors all tilt away from it."
      }
    ],
    characterIds: ["char-mara-vell", "char-captain-maudrin"],
    discovery: "A drowned scribe carried the same seal.",
    threat: "Lighthouse guards begin a public search.",
    canonFacts: ["The market tied the black seal to a drowned scribe."],
    choices: [
      {
        id: "question-bell-seller",
        label: "Question the bell seller",
        intent: "Ask what he knows about the drowned scribe.",
        intentKey: "social",
        risk: "medium",
        nextBeatId: "beat-archive-door",
        effects: {
          setFlags: { knowsAboutDrownedScribe: true },
          discoveries: ["The drowned scribe was named Iven Rook."],
          relationshipDeltas: { "char-orrin-tyde": 1 },
          canonFacts: ["Mara learned about the drowned scribe."],
          memory: "Mara pulled a name from harbor rumor."
        }
      },
      {
        id: "duck-the-watch",
        label: "Duck under the fish awning",
        intent: "Hide from the lighthouse guard search.",
        intentKey: "stealth",
        risk: "low",
        nextBeatId: "beat-lantern-walk",
        effects: {
          setFlags: { avoidedWatch: true, followedLanternPath: true },
          dangerDelta: -1,
          canonFacts: ["Mara avoided the first lighthouse search."],
          memory: "Mara slipped out while the market lied for her."
        }
      },
      {
        id: "follow-guard",
        label: "Follow the guard captain",
        intent: "Trail the guard to learn why they want the letter.",
        intentKey: "investigation",
        risk: "high",
        nextBeatId: "beat-watch-house",
        effects: {
          setFlags: { alertedLighthouseGuard: true },
          dangerDelta: 2,
          canonFacts: ["Mara followed the lighthouse guard into their jurisdiction."],
          memory: "Mara chose a dangerous answer over a safe exit."
        }
      }
    ],
    customRoutes: {
      social: "beat-archive-door",
      stealth: "beat-lantern-walk",
      investigation: "beat-watch-house",
      retreat: "beat-lantern-walk",
      dangerous: "beat-watch-house"
    },
    defaultNextBeatId: "beat-archive-door"
  },
  {
    id: "beat-archive-door",
    chapter: 2,
    title: "Orrin's Keys",
    locationId: "loc-underpier-archive",
    summary: "Orrin tests Mara before opening the archive below the tide.",
    paragraphs: [
      "Orrin Tyde waits at the dry door beneath Pier Nine with a key ring folded inside his fist. The tide is above them now, pressing the ceiling with a patient hand.",
      "He does not ask for the letter. He asks whether Mara knows what a city does to the person who proves its lawful ruler was erased.",
      "The door behind him smells of wax, paper, and cold salt locked away for generations."
    ],
    variants: [
      {
        flag: "trustsOrrin",
        text: "Because Mara trusted him at the stair, Orrin has already turned the first lock before he speaks."
      },
      {
        flag: "alertedLighthouseGuard",
        text: "Above them, boots hit the pier in measured pairs. The guard search has reached the waterline."
      }
    ],
    characterIds: ["char-mara-vell", "char-orrin-tyde"],
    discovery: "Orrin knows the letter concerns an erased heir.",
    threat: "The archive door can trap Mara if the guard descends.",
    canonFacts: ["Orrin knew the letter could challenge the council."],
    choices: [
      {
        id: "show-letter",
        label: "Show Orrin the seal",
        intent: "Let Orrin verify the black wax.",
        intentKey: "social",
        risk: "medium",
        nextBeatId: "beat-underpier-archive",
        effects: {
          setFlags: { trustsOrrin: true, alliedWithArchivist: true },
          relationshipDeltas: { "char-orrin-tyde": 2 },
          canonFacts: ["Orrin verified the black seal without opening the letter."],
          memory: "Mara made Orrin an archivist ally."
        }
      },
      {
        id: "search-lock",
        label: "Search the lock plate",
        intent: "Inspect the archive door before trusting anyone.",
        intentKey: "investigation",
        risk: "low",
        nextBeatId: "beat-underpier-archive",
        effects: {
          discoveries: ["The lock plate bears Iven Rook's initials."],
          setFlags: { knowsAboutDrownedScribe: true },
          canonFacts: ["The drowned scribe marked the archive door."],
          memory: "Mara found the scribe's initials on the archive lock."
        }
      },
      {
        id: "force-door",
        label: "Force your way inside",
        intent: "Shove past Orrin and open the archive by pressure.",
        intentKey: "dangerous",
        risk: "high",
        nextBeatId: "beat-underpier-archive",
        effects: {
          setFlags: { alertedLighthouseGuard: true },
          relationshipDeltas: { "char-orrin-tyde": -2 },
          dangerDelta: 2,
          warnings: ["Orrin will remember being forced aside."],
          canonFacts: ["Mara forced the archive door under pressure."],
          memory: "Mara entered the archive with trust damaged."
        }
      }
    ],
    customRoutes: {
      social: "beat-underpier-archive",
      investigation: "beat-underpier-archive",
      stealth: "beat-underpier-archive",
      retreat: "beat-lantern-walk",
      dangerous: "beat-underpier-archive"
    },
    defaultNextBeatId: "beat-underpier-archive"
  },
  {
    id: "beat-underpier-archive",
    chapter: 2,
    title: "The Tide Ledger",
    locationId: "loc-underpier-archive",
    summary: "The archive reveals that the city rewrote its lawful succession.",
    paragraphs: [
      "The Archive Under Pier Nine is warmer than the street, lit by green glass lamps and crowded with ledgers sewn into oilcloth.",
      "Orrin draws out the tide ledger. Its pages ripple without wind, opening to a place where one name has been scraped thin and rewritten in a council hand.",
      "The black seal answers from Mara's coat, tugging toward the wounded page."
    ],
    variants: [
      {
        flag: "alliedWithArchivist",
        text: "Orrin places his own seal beside hers, making the archive complicit in what happens next."
      },
      {
        flag: "letterDamaged",
        text: "The damaged edge of the letter stains the ledger margin blue."
      }
    ],
    characterIds: ["char-mara-vell", "char-orrin-tyde"],
    discovery: "The tide ledger was altered by the council.",
    threat: "The archive lamps begin to gutter, warning that someone opened a mirror door above.",
    canonFacts: ["The tide ledger was opened.", "The council altered a succession page."],
    choices: [
      {
        id: "read-ledger",
        label: "Read the scraped name",
        intent: "Study the altered succession page.",
        intentKey: "investigation",
        risk: "medium",
        nextBeatId: "beat-scribe-vault",
        effects: {
          setFlags: { exposedCouncilSecret: true },
          discoveries: ["The council erased the name Vell from the succession page."],
          canonFacts: ["The council secret was exposed."],
          memory: "Mara saw the Vell name scraped from the tide ledger."
        }
      },
      {
        id: "hide-ledger",
        label: "Hide the ledger page",
        intent: "Protect the proof before the guard arrives.",
        intentKey: "protect",
        risk: "medium",
        nextBeatId: "beat-scribe-vault",
        effects: {
          setFlags: { alliedWithArchivist: true },
          relationshipDeltas: { "char-orrin-tyde": 1 },
          canonFacts: ["Mara protected the altered ledger page."],
          memory: "Mara protected proof before chasing certainty."
        }
      },
      {
        id: "flee-archive",
        label: "Flee toward the lantern stair",
        intent: "Leave before the archive becomes a trap.",
        intentKey: "retreat",
        risk: "low",
        nextBeatId: "beat-lantern-walk",
        effects: {
          setFlags: { followedLanternPath: true },
          canonFacts: ["Mara fled the archive with partial proof."],
          memory: "Mara carried the mystery back into the open air."
        }
      }
    ],
    customRoutes: {
      investigation: "beat-scribe-vault",
      protect: "beat-scribe-vault",
      retreat: "beat-lantern-walk",
      stealth: "beat-lantern-walk",
      dangerous: "beat-watch-house"
    },
    defaultNextBeatId: "beat-scribe-vault"
  },
  {
    id: "beat-lantern-walk",
    chapter: 2,
    title: "Blue Lanterns",
    locationId: "loc-lantern-walk",
    summary: "The service path offers stealth, but Sister Elan controls the mirror keys.",
    paragraphs: [
      "The Lantern Walk runs along the harbor roofs, too narrow for carts and too public for secrets. Blue lamps burn in niches where ordinary flame should be gold.",
      "Sister Elan stands beside the lower lighthouse door, her sleeve full of keys and her eyes fixed on Mara's coat.",
      "She says the Tallow Prince has lit three forbidden candles tonight, and one of them is waiting for the letter."
    ],
    variants: [
      {
        flag: "followedLanternPath",
        text: "Because Mara chose the service route early, Sister Elan greets her as someone who understands quiet doors."
      },
      {
        flag: "alertedLighthouseGuard",
        text: "A watch whistle below tells Mara the quiet path is closing behind her."
      }
    ],
    characterIds: ["char-mara-vell", "char-sister-elan"],
    discovery: "The Tallow Prince has agents inside the lighthouse.",
    threat: "The guard can cut off the lower door.",
    canonFacts: ["The Lantern Walk led Mara toward the lighthouse keys."],
    choices: [
      {
        id: "ask-elan-help",
        label: "Ask Sister Elan for a key",
        intent: "Trust Elan with enough truth to gain access.",
        intentKey: "social",
        risk: "medium",
        nextBeatId: "beat-lighthouse-base",
        effects: {
          relationshipDeltas: { "char-sister-elan": 2 },
          canonFacts: ["Sister Elan considered helping Mara reach the mirror room."],
          memory: "Mara brought Sister Elan into the edge of the truth."
        }
      },
      {
        id: "douse-lamp",
        label: "Douse the blue lamp",
        intent: "Make the watch lose the service path.",
        intentKey: "stealth",
        risk: "medium",
        nextBeatId: "beat-lighthouse-base",
        effects: {
          setFlags: { avoidedWatch: true },
          dangerDelta: -1,
          canonFacts: ["Mara darkened a blue lantern on the service walk."],
          memory: "Mara bought time by stealing light."
        }
      },
      {
        id: "break-key-chain",
        label: "Snatch the mirror keys",
        intent: "Take Elan's keys by force.",
        intentKey: "dangerous",
        risk: "high",
        nextBeatId: "beat-lighthouse-base",
        effects: {
          setFlags: { alertedLighthouseGuard: true },
          relationshipDeltas: { "char-sister-elan": -2 },
          dangerDelta: 2,
          warnings: ["Sister Elan will resist Mara at the mirror room."],
          canonFacts: ["Mara took lighthouse access by force."],
          memory: "Mara gained a key and lost mercy."
        }
      }
    ],
    customRoutes: {
      social: "beat-lighthouse-base",
      stealth: "beat-lighthouse-base",
      investigation: "beat-lighthouse-base",
      retreat: "beat-watch-house",
      dangerous: "beat-lighthouse-base"
    },
    defaultNextBeatId: "beat-lighthouse-base"
  },
  {
    id: "beat-watch-house",
    chapter: 2,
    title: "Captain Maudrin's Lamp",
    locationId: "loc-saltglass-harbor",
    summary: "The guard confronts Mara and turns danger into a public problem.",
    paragraphs: [
      "Captain Maudrin's watch room smells of lamp oil and wet wool. Mara is not chained, which makes the locked door more insulting.",
      "Maudrin lays a brass mirror on the table. The black seal appears in it before Mara's hand does.",
      "He says the council calls the letter counterfeit, but the lighthouse law requires him to treat any seal that reflects blue as evidence."
    ],
    variants: [
      {
        flag: "alertedLighthouseGuard",
        text: "Because the guard was already alerted, Maudrin has three witnesses waiting in the hall."
      }
    ],
    characterIds: ["char-mara-vell", "char-captain-maudrin"],
    discovery: "The guard can be forced to acknowledge blue-reflecting evidence.",
    threat: "If Maudrin seizes the letter, the council can bury it legally.",
    canonFacts: ["Captain Maudrin saw the seal reflect blue."],
    choices: [
      {
        id: "invoke-law",
        label: "Invoke lighthouse law",
        intent: "Force Maudrin to treat the letter as evidence.",
        intentKey: "social",
        risk: "medium",
        nextBeatId: "beat-lighthouse-base",
        effects: {
          relationshipDeltas: { "char-captain-maudrin": 1 },
          canonFacts: ["Mara invoked lighthouse evidence law."],
          memory: "Mara made the guard's rules work against the council."
        }
      },
      {
        id: "search-mirror",
        label: "Study the brass mirror",
        intent: "Inspect what the guard mirror reveals about the seal.",
        intentKey: "investigation",
        risk: "medium",
        nextBeatId: "beat-scribe-vault",
        effects: {
          setFlags: { inspectedSeal: true },
          discoveries: ["The seal reflects a drowned handprint in brass mirrors."],
          canonFacts: ["The guard mirror revealed the drowned scribe's mark."],
          memory: "Mara turned custody into evidence."
        }
      },
      {
        id: "escape-watch",
        label: "Escape through the coal hatch",
        intent: "Run before Maudrin can lock the letter away.",
        intentKey: "retreat",
        risk: "high",
        nextBeatId: "beat-lantern-walk",
        effects: {
          setFlags: { avoidedWatch: true, followedLanternPath: true },
          dangerDelta: 1,
          canonFacts: ["Mara escaped the watch house with the letter."],
          memory: "Mara chose flight over procedure."
        }
      }
    ],
    customRoutes: {
      social: "beat-lighthouse-base",
      investigation: "beat-scribe-vault",
      retreat: "beat-lantern-walk",
      stealth: "beat-lantern-walk",
      dangerous: "beat-lighthouse-base"
    },
    defaultNextBeatId: "beat-lighthouse-base"
  },
  {
    id: "beat-scribe-vault",
    chapter: 3,
    title: "The Drowned Scribe",
    locationId: "loc-underpier-archive",
    summary: "Mara learns who wrote the letter and why the seal resists destruction.",
    paragraphs: [
      "Below the archive floor, Orrin opens a vault no ledger admits exists. The walls are tiled with names of dead clerks, each one painted in waterproof black.",
      "Iven Rook's name is not on the drowned wall. It has been scratched into the ceiling, above a shelf of letters never delivered.",
      "Mara's black-sealed envelope trembles when she lifts it, as if another hand is holding the paper from the inside."
    ],
    variants: [
      {
        flag: "knowsAboutDrownedScribe",
        text: "The name Iven Rook lands harder because Mara has already heard it whispered like a curse."
      },
      {
        flag: "alliedWithArchivist",
        text: "Orrin breaks archive law by handing Mara the dead scribe's index."
      }
    ],
    characterIds: ["char-mara-vell", "char-orrin-tyde"],
    discovery: "Iven Rook was hidden from the official drowned register.",
    threat: "A candle mark on the vault glass means the Tallow Prince found the archive before them.",
    canonFacts: ["Mara learned about the drowned scribe."],
    choices: [
      {
        id: "open-letter",
        label: "Open the letter",
        intent: "Read the proof despite the risk.",
        intentKey: "investigation",
        risk: "high",
        nextBeatId: "beat-lighthouse-base",
        effects: {
          setFlags: { letterOpened: true, knowsAboutDrownedScribe: true },
          discoveries: ["Iven Rook accused the council of erasing the Vell succession."],
          dangerDelta: 1,
          canonFacts: ["The black-sealed letter mattered to the succession."],
          memory: "Mara opened the letter and accepted its danger."
        }
      },
      {
        id: "copy-scribe-index",
        label: "Copy Iven's index",
        intent: "Preserve proof without breaking the seal.",
        intentKey: "protect",
        risk: "medium",
        nextBeatId: "beat-lighthouse-base",
        effects: {
          setFlags: { knowsAboutDrownedScribe: true },
          discoveries: ["Iven Rook indexed council edits by mirror number."],
          relationshipDeltas: { "char-orrin-tyde": 1 },
          canonFacts: ["Mara preserved the drowned scribe's index."],
          memory: "Mara kept the letter sealed but widened the proof."
        }
      },
      {
        id: "chase-candle-mark",
        label: "Follow the candle mark",
        intent: "Track the Tallow Prince's sign toward the lighthouse.",
        intentKey: "stealth",
        risk: "medium",
        nextBeatId: "beat-lighthouse-base",
        effects: {
          setFlags: { followedLanternPath: true },
          canonFacts: ["Mara followed the Tallow Prince's candle mark."],
          memory: "Mara let the enemy's sign become a map."
        }
      }
    ],
    customRoutes: {
      investigation: "beat-lighthouse-base",
      protect: "beat-lighthouse-base",
      stealth: "beat-lighthouse-base",
      social: "beat-lighthouse-base",
      retreat: "beat-lantern-walk",
      dangerous: "beat-watch-house"
    },
    defaultNextBeatId: "beat-lighthouse-base"
  },
  {
    id: "beat-lighthouse-base",
    chapter: 3,
    title: "The Lower Light",
    locationId: "loc-lantern-walk",
    summary: "The lower lighthouse door forces Mara to choose between law, stealth, and escalation.",
    paragraphs: [
      "The lower lighthouse rises from the end of the Lantern Walk, its stones black with old weather and its brass hinges polished by frightened hands.",
      "Captain Maudrin arrives from one side, Sister Elan from the other. Neither fully trusts Mara, but both understand the blue shine leaking through her coat.",
      "Above them, a mirror turns without anyone touching it."
    ],
    variants: [
      {
        flag: "avoidedWatch",
        text: "Because Mara avoided the watch earlier, Maudrin has fewer guards and less patience."
      },
      {
        flag: "letterOpened",
        text: "The opened letter whispers against its own crease when the mirror turns."
      }
    ],
    characterIds: ["char-mara-vell", "char-sister-elan", "char-captain-maudrin"],
    discovery: "The mirror room is already moving under hostile control.",
    threat: "The lighthouse can broadcast the council's version first.",
    canonFacts: ["Mara reached the lower lighthouse with the letter."],
    choices: [
      {
        id: "ally-guard",
        label: "Make Maudrin witness",
        intent: "Turn the guard captain into a lawful witness.",
        intentKey: "social",
        risk: "medium",
        nextBeatId: "beat-mirror-room",
        effects: {
          relationshipDeltas: { "char-captain-maudrin": 2 },
          canonFacts: ["Captain Maudrin became a witness to the letter's claim."],
          memory: "Mara made the guard part of the record."
        }
      },
      {
        id: "mirror-stair",
        label: "Climb the mirror stair unseen",
        intent: "Reach the mirror room before the guard can stop her.",
        intentKey: "stealth",
        risk: "medium",
        nextBeatId: "beat-mirror-room",
        effects: {
          setFlags: { avoidedWatch: true },
          canonFacts: ["Mara reached the mirror stair by stealth."],
          memory: "Mara chose the narrow stair and kept the letter moving."
        }
      },
      {
        id: "force-bell",
        label: "Strike the lower bell",
        intent: "Force everyone nearby to hear the lighthouse answer.",
        intentKey: "reveal",
        risk: "high",
        nextBeatId: "beat-mirror-room",
        effects: {
          setFlags: { exposedCouncilSecret: true, alertedLighthouseGuard: true },
          dangerDelta: 2,
          canonFacts: ["Mara rang a lower lighthouse bell before the mirror room."],
          memory: "Mara turned secrecy into public sound."
        }
      }
    ],
    customRoutes: {
      social: "beat-mirror-room",
      stealth: "beat-mirror-room",
      reveal: "beat-mirror-room",
      investigation: "beat-mirror-room",
      retreat: "beat-watch-house",
      dangerous: "beat-mirror-room"
    },
    defaultNextBeatId: "beat-mirror-room"
  },
  {
    id: "beat-mirror-room",
    chapter: 4,
    title: "The Tallow Reflection",
    locationId: "loc-lighthouse-mirror-room",
    summary: "The mirror room shows the Tallow Prince's hand and the council's secret together.",
    paragraphs: [
      "The mirror room is all brass ribs and old glass, a library of reflected orders. Every mirror faces a different civic door below.",
      "In the largest glass, the Tallow Prince appears only as a candle flame with a man's shadow behind it. He touches the reflection of Mara's letter, and the seal answers.",
      "The mirrors show the same impossible fact from twelve angles: the council's chosen heir stands on a scraped-out Vell name."
    ],
    variants: [
      {
        flag: "exposedCouncilSecret",
        text: "Because Mara has already pushed the secret into the open, the mirrors tremble toward confession."
      },
      {
        flag: "letterDamaged",
        text: "The damaged letter throws a broken blue line across the Prince's candle flame."
      }
    ],
    characterIds: ["char-mara-vell", "char-sister-elan", "char-captain-maudrin"],
    discovery: "The Tallow Prince benefits from the erased Vell succession.",
    threat: "The Prince can turn the mirrors to publish a false order first.",
    canonFacts: ["The Tallow Prince's claim depended on the council secret."],
    choices: [
      {
        id: "expose-mirrors",
        label: "Turn the mirrors outward",
        intent: "Expose the council secret to the harbor.",
        intentKey: "reveal",
        risk: "high",
        nextBeatId: "beat-council-chamber",
        effects: {
          setFlags: { exposedCouncilSecret: true },
          dangerDelta: 2,
          endingDirection: "revolt",
          canonFacts: ["Mara prepared the mirror room to expose the council."],
          memory: "Mara chose public truth over quiet leverage."
        }
      },
      {
        id: "shield-orrin",
        label: "Shield Orrin's evidence",
        intent: "Protect the archive proof from the Prince's reflection.",
        intentKey: "protect",
        risk: "medium",
        nextBeatId: "beat-council-chamber",
        effects: {
          setFlags: { alliedWithArchivist: true },
          relationshipDeltas: { "char-orrin-tyde": 1 },
          endingDirection: "archivist",
          canonFacts: ["Mara protected archive proof in the mirror room."],
          memory: "Mara kept the proof intact for the ledger."
        }
      },
      {
        id: "bargain-prince",
        label: "Bargain with the reflection",
        intent: "Use the letter as leverage against the Tallow Prince.",
        intentKey: "social",
        risk: "high",
        nextBeatId: "beat-council-chamber",
        effects: {
          dangerDelta: 1,
          endingDirection: "exile",
          warnings: ["The Prince now knows Mara is willing to bargain."],
          canonFacts: ["Mara bargained with the Tallow Prince's reflection."],
          memory: "Mara made the enemy answer directly."
        }
      }
    ],
    customRoutes: {
      reveal: "beat-council-chamber",
      protect: "beat-council-chamber",
      social: "beat-council-chamber",
      investigation: "beat-council-chamber",
      retreat: "beat-tide-bridge",
      dangerous: "beat-council-chamber"
    },
    defaultNextBeatId: "beat-council-chamber"
  },
  {
    id: "beat-council-chamber",
    chapter: 4,
    title: "The Wax Council",
    locationId: "loc-lighthouse-mirror-room",
    summary: "The council tries to turn law, fear, and public order against Mara.",
    paragraphs: [
      "The council chamber answers through the mirrors first: faces framed in gilt, voices flattened into official calm.",
      "They call Mara a courier of counterfeit grief. They call Orrin a failed clerk. They call the drowned scribe an old harbor superstition.",
      "Then the black seal prints itself across every mirror, and the chamber falls quiet enough for Mara to hear wax crack."
    ],
    variants: [
      {
        flag: "letterOpened",
        text: "Because the letter is open, Iven Rook's handwriting appears backward on the glass."
      },
      {
        flag: "alliedWithArchivist",
        text: "Orrin reads the ledger references aloud before the council can interrupt him."
      }
    ],
    characterIds: ["char-mara-vell", "char-orrin-tyde", "char-captain-maudrin"],
    discovery: "The council fears the letter being recorded more than being seen.",
    threat: "The council can still order the guard to seize the physical letter.",
    canonFacts: ["The council heard the black-sealed letter's claim."],
    choices: [
      {
        id: "read-letter-aloud",
        label: "Read the letter aloud",
        intent: "Make the accusation public through the mirrors.",
        intentKey: "reveal",
        risk: "high",
        nextBeatId: "beat-tide-bridge",
        effects: {
          setFlags: { letterOpened: true, exposedCouncilSecret: true },
          dangerDelta: 2,
          endingDirection: "revolt",
          canonFacts: ["Mara read Iven Rook's accusation through the mirrors."],
          memory: "Mara used the letter as a public bell."
        }
      },
      {
        id: "enter-ledger-proof",
        label: "Enter proof into the ledger",
        intent: "Make the archive record harder to erase.",
        intentKey: "protect",
        risk: "medium",
        nextBeatId: "beat-tide-bridge",
        effects: {
          setFlags: { alliedWithArchivist: true, exposedCouncilSecret: true },
          endingDirection: "archivist",
          canonFacts: ["Mara moved the proof toward the tide ledger."],
          memory: "Mara chose record over spectacle."
        }
      },
      {
        id: "carry-letter-away",
        label: "Carry the letter away",
        intent: "Keep the proof from both council and Prince.",
        intentKey: "retreat",
        risk: "medium",
        nextBeatId: "beat-tide-bridge",
        effects: {
          endingDirection: "exile",
          canonFacts: ["Mara refused to surrender the letter to the council."],
          memory: "Mara kept the letter mobile when the city tried to own it."
        }
      }
    ],
    customRoutes: {
      reveal: "beat-tide-bridge",
      protect: "beat-tide-bridge",
      retreat: "beat-tide-bridge",
      investigation: "beat-tide-bridge",
      social: "beat-tide-bridge",
      dangerous: "beat-tide-bridge"
    },
    defaultNextBeatId: "beat-tide-bridge"
  },
  {
    id: "beat-tide-bridge",
    chapter: 5,
    title: "The Tide Bridge",
    locationId: "loc-saltglass-harbor",
    summary: "Mara crosses above the tide as the city begins choosing what it believes.",
    paragraphs: [
      "The tide bridge shakes under the weight of people coming out of doorways with coats half-buttoned and questions fully awake.",
      "Behind Mara, the lighthouse mirrors swing between council order, archive proof, and the Tallow Prince's candle mark.",
      "Below her, the water opens and closes over the bridge pilings like a mouth practicing a verdict."
    ],
    variants: [
      {
        flag: "alertedLighthouseGuard",
        text: "The lighthouse guard forms lines on both ends of the bridge."
      },
      {
        flag: "exposedCouncilSecret",
        text: "The crowd already knows enough to be dangerous."
      }
    ],
    characterIds: ["char-mara-vell", "char-orrin-tyde", "char-captain-maudrin", "char-sister-elan"],
    discovery: "The city itself is becoming the final witness.",
    threat: "A wrong move can turn proof into riot or silence.",
    canonFacts: ["Mara carried the letter onto the Tide Bridge."],
    choices: [
      {
        id: "seal-proof",
        label: "Seal the proof in the ledger",
        intent: "Bind the letter to the official archive record.",
        intentKey: "resolve",
        risk: "medium",
        nextBeatId: "beat-black-seal-choice",
        effects: {
          endingDirection: "archivist",
          setFlags: { alliedWithArchivist: true },
          canonFacts: ["Mara chose the archive as the letter's destination."],
          memory: "Mara turned toward durable record."
        }
      },
      {
        id: "ring-harbor-bells",
        label: "Ring the harbor bells",
        intent: "Let the city hear the council secret at once.",
        intentKey: "reveal",
        risk: "high",
        nextBeatId: "beat-black-seal-choice",
        effects: {
          endingDirection: "revolt",
          setFlags: { exposedCouncilSecret: true },
          dangerDelta: 2,
          canonFacts: ["Mara chose public exposure on the Tide Bridge."],
          memory: "Mara made the city itself a witness."
        }
      },
      {
        id: "take-black-boat",
        label: "Take the black boat",
        intent: "Carry the letter beyond Saltglass before either side can seize it.",
        intentKey: "retreat",
        risk: "medium",
        nextBeatId: "beat-black-seal-choice",
        effects: {
          endingDirection: "exile",
          canonFacts: ["Mara chose to keep the letter moving beyond Saltglass."],
          memory: "Mara chose motion over ownership."
        }
      }
    ],
    customRoutes: {
      resolve: "beat-black-seal-choice",
      reveal: "beat-black-seal-choice",
      retreat: "beat-black-seal-choice",
      protect: "beat-black-seal-choice",
      social: "beat-black-seal-choice",
      dangerous: "beat-black-seal-choice"
    },
    defaultNextBeatId: "beat-black-seal-choice"
  },
  {
    id: "beat-black-seal-choice",
    chapter: 5,
    title: "What the Seal Remembers",
    locationId: "loc-saltglass-harbor",
    summary: "The seal makes the final direction irreversible.",
    paragraphs: [
      "At the bridge center, the black seal lifts from the paper without tearing it. It hovers between Mara's hands like a drop of night refusing to fall.",
      "The seal shows her three truths: the archive can preserve the proof, the bells can force the truth public, and the black boat can carry the evidence where Saltglass cannot reach.",
      "None of the choices returns Mara to the life she had before the third stair."
    ],
    variants: [
      {
        flag: "letterDamaged",
        text: "The damaged letter still holds, but the seal's blue edge is ragged and angry."
      },
      {
        flag: "trustsOrrin",
        text: "Orrin waits without asking to take the letter from her."
      }
    ],
    characterIds: ["char-mara-vell", "char-orrin-tyde", "char-sister-elan", "char-captain-maudrin"],
    discovery: "The seal will preserve Mara's chosen ending direction.",
    threat: "Delay gives the Prince time to turn the mirrors again.",
    canonFacts: ["Mara chose how the letter entered Saltglass canon."],
    choices: [
      {
        id: "final-archive",
        label: "Give the seal to the archive",
        intent: "Make the proof part of the tide ledger.",
        intentKey: "resolve",
        risk: "low",
        nextBeatId: "ending-archivist",
        effects: {
          endingDirection: "archivist",
          setFlags: { alliedWithArchivist: true },
          canonFacts: ["Mara committed the letter to the archive ending."],
          memory: "Mara chose the archive's slow permanence."
        }
      },
      {
        id: "final-bells",
        label: "Press the seal to the bell rope",
        intent: "Make the truth ring across Saltglass.",
        intentKey: "reveal",
        risk: "medium",
        nextBeatId: "ending-revolt",
        effects: {
          endingDirection: "revolt",
          setFlags: { exposedCouncilSecret: true },
          dangerDelta: 1,
          canonFacts: ["Mara committed the letter to the bell ending."],
          memory: "Mara chose the city's immediate judgment."
        }
      },
      {
        id: "final-boat",
        label: "Carry the seal to the black boat",
        intent: "Leave with the proof before any faction owns it.",
        intentKey: "retreat",
        risk: "medium",
        nextBeatId: "ending-exile",
        effects: {
          endingDirection: "exile",
          canonFacts: ["Mara committed the letter to the black boat ending."],
          memory: "Mara chose the uncertain road beyond Saltglass."
        }
      }
    ],
    customRoutes: {
      resolve: "ending-archivist",
      protect: "ending-archivist",
      reveal: "ending-revolt",
      social: "ending-revolt",
      retreat: "ending-exile",
      stealth: "ending-exile",
      dangerous: "ending-revolt"
    },
    defaultNextBeatId: "ending-archivist"
  }
];
