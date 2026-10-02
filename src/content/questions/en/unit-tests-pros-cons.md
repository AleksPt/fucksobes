---
title: "What are the advantages and disadvantages of unit tests?"
category: testing
order: 2
---

**Advantages:**

- bugs are found early and localized to a specific module;
- refactoring becomes safer, and regressions show up immediately;
- tests work as living documentation and push toward more loosely coupled, testable code;
- they run fast and automatically, including in CI.

**Disadvantages:**

- time to write and maintain them: when the code changes, the tests have to be updated;
- they check parts separately, so they don't guarantee the app works as a whole (integration, UI, the real network);
- badly written tests (tightly tied to the implementation, with excessive mocks) break on any refactoring and give a false sense of security;
- some code (for example, UI) is hard to cover with them.

That is why unit tests are complemented by integration and UI tests.

**Compared with other kinds of tests** (integration and E2E), unit tests are faster and more stable, point more precisely at the location of a bug, need no environment (server, device, database) and are cheaper to maintain. In return, they don't check integration or real user scenarios, so they are complemented by the higher levels of the testing pyramid.
