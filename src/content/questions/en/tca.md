---
title: "Have you heard of TCA?"
category: architecture
order: 43
---

TCA (The Composable Architecture) is a Point-Free framework for a unidirectional architecture inspired by Redux and Elm. An app is described through four concepts: `State`, `Action`, `Reducer` (a pure function that, given an action, changes the state and returns effects), and `Store` (the store the interface connects to). Side effects (networking, timers) are expressed as separate `Effect`s, and dependencies are plugged in through the built-in `@Dependency` system.

Pros: predictable state and ease of testing (you can verify every change), composition of small features into large ones, and good integration with SwiftUI. Cons: a steep learning curve, a lot of boilerplate, dependence on a third-party framework and its updates, and an impact on compile times.
