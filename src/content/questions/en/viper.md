---
title: "What is VIPER? What does it consist of?"
category: architecture
order: 39
---

VIPER is an architecture that divides a module (usually one screen) into five components, each with a single responsibility:

- `View`: a passive interface that displays data and passes events to the presenter;
- `Interactor`: business logic: working with data, the network, and storage;
- `Presenter`: prepares data for the View and reacts to events; it connects the Interactor, the View, and the Router;
- `Entity`: plain data models;
- `Router` (Wireframe): navigation; in classic VIPER it also assembles the module, but assembly can be moved to a separate `Assembly`/`Builder` (both options are acceptable).

Dependencies between components are built through protocols, so each one can be tested separately. VIPER suits large teams and projects with clear module boundaries, but it requires a lot of code and splitting into files even for a simple screen.
