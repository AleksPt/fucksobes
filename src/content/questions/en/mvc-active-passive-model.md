---
title: "What are the active and passive models in MVC? What is the difference?"
category: architecture
order: 54
---

These are two variants of how the View learns about changes in the Model.

**Passive model.** The model knows nothing about the View and the Controller and simply stores data. All changes go through the Controller: it receives the user's action, updates the model, and updates the View itself. This is how classic Apple MVC works: `UIViewController` takes data from the model and configures the view. Pro: simplicity and an explicit data flow. Con: the Controller grows (Massive View Controller).

**Active model.** The model itself notifies interested parties about its changes (the Observer pattern: `NotificationCenter`, KVO, Combine, delegates), and the View subscribes and updates itself. This is how the original MVC from Smalltalk works. Pros: the View is always in sync with the model, several Views can display one model, and the Controller is simpler. Con: the data flow is harder to trace, and it is easy to end up with redundant updates and retain cycles.

The active model is the conceptual basis of MVVM and reactive approaches.
