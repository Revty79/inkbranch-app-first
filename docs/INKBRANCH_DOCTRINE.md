# Inkbranch Doctrine

Inkbranch is a book-first, world-first branching story platform.

The author writes the spine. The reader lives the variation. AI renders the path inside canon.

## Core Principles

- Author canon is the source of truth.
- Reader choices create personal run canon.
- AI never owns the plot, ending, world rules, or character truth.
- Generated scenes must follow the planner, current reader state, and story bible.
- Inkbranch is not a chatbot and not a generic writing assistant.

## Author Control

Authors define the book, world, characters, locations, required events, ending constraints, and canon rules. The system can vary scene rendering and path details, but it cannot contradict author-written facts or replace the story spine.

## Reader Control

Readers choose how their run moves through the authored spine. Their choices are committed as run canon through `CanonCommit` and `MemoryUpdate` records. Two readers can experience different routes while still living inside the same book.

## AI Scope

AI is a renderer. It receives approved scene structure, canon, constraints, and reader state. It returns structured scene results with text, choices, state changes, and memory updates. It does not freely improvise the central story.
