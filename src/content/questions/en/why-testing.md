---
title: "Why is testing code necessary? What can make it harder?"
category: testing
order: 20
---

Tests are needed to:

- find bugs before release, and faster than manual checking;
- change and refactor code safely: a failing test immediately shows a regression;
- pin down the expected behavior (tests serve as documentation);
- improve code design: what is easy to test is usually loosely coupled and split into small parts;
- speed up development in the long run and increase confidence when making changes and deploying (CI).

What makes testing harder:

- **tight coupling** and hard dependencies (singletons, services created inside classes) that can't be replaced;
- **global and hidden state**, time, random values, the network and the file system inside the logic;
- **mixing logic and UI**: Massive View Controller, business logic in a `UIViewController`;
- **side effects** and functions with no explicit result;
- **asynchronous code** and multithreading, which make tests unstable (flaky);
- a lack of abstractions (protocols) and Dependency Injection, so test doubles can't be substituted.

Testability is improved through DI, protocols, separation of layers and pure functions.
