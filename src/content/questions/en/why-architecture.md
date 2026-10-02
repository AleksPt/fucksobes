---
title: "Why does a project need an architecture? Why split code into layers?"
category: architecture
order: 56
---

An architecture defines the structure of an app and the rules by which its parts communicate. It is needed so that the project can be developed and maintained as it grows:

- **separation of concerns**: each layer solves its own task (UI, logic, data), so the code is easier to understand and change;
- **testability**: business logic can be verified without the UI and the network by substituting dependencies;
- **replacing details**: the networking layer, the database, or the UI framework can be swapped without rewriting the rest;
- **teamwork**: people work on different parts in parallel, with fewer conflicts and shared conventions;
- **reuse** and managed complexity: fewer connections and faster onboarding of new developers.

Layers (usually Presentation, Domain, Data) are separated so that dependencies go in one direction: the UI knows nothing about storage details, and business logic knows nothing about the UI and the network. An architecture has a cost: more code and abstractions, so its scale is chosen to fit the size of the project and the team, not "for growth".
