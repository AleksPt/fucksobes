---
title: "What is the point of the MVVM pattern?"
category: architecture
order: 26
---

The point of MVVM is to move presentation logic out of the view into a separate abstraction, the **ViewModel**, which is "more of a model than a view". It exposes public properties and commands, and the view binds to them directly and receives updates through binding, so no boilerplate synchronization code is needed.

Unlike MVP, the ViewModel does not hold a reference to the View: it stays independent of it.

A related idea from Fowler is the Presentation Model: a model designed for the presentation layer. It stores the view's state (for example, the selected item or whether a button is enabled) and keeps the domain model clean.

