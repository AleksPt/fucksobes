---
title: "What kinds of tests are there?"
category: testing
order: 11
---

By level of verification:

- **Unit** tests check an individual function or class in isolation from its dependencies;
- **Component and integration** tests check how several modules or layers interact (for example, a repository and a database);
- **E2E (end-to-end)** tests walk through a user scenario across the whole app, including the interface and the server.

Other kinds:

- **UI tests**: checking the interface and navigation (XCUITest);
- **Snapshot tests**: comparing the appearance with a reference;
- **Regression tests**: checking that new changes haven't broken old behavior;
- **Smoke tests**: a quick check that the key features work;
- **Load and performance tests** (`measure` in XCTest);
- **Manual and exploratory testing**.

They are combined following the testing pyramid: many fast unit tests and a few expensive E2E tests.
