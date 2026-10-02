---
title: "What is wrong with VIPER? What drawbacks of different architectural approaches have you found, and how did you solve them?"
category: architecture
order: 40
---

The main drawbacks of VIPER:

- a lot of boilerplate: a simple screen requires creating 5 components and a set of protocols (code generators reduce the boilerplate);
- redundancy: some components become "pass-throughs" that merely forward calls;
- difficulties with navigation and passing data between modules;
- a steep learning curve for new developers.

Other approaches have their own drawbacks: Apple MVC leads to Massive View Controller (solved by moving logic into services or switching to MVP/MVVM); in MVVM the ViewModel can also bloat, and bindings are hard to debug; MVP has many protocols and manual View updates.

What solves this universally is a deliberate choice: treat the architecture as a set of guidelines tailored to the project's size and tasks, don't add layers without need, split large modules, use DI, and cover the logic with tests.
