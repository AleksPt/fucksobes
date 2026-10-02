---
title: "What are MVC and MVVM?"
category: architecture
order: 25
---

**MVC** (Model View Controller) separates the domain model from the presentation (view and controller). Views observe the model and update when it changes, so several views can display one model at the same time.

**MVVM** (Model–View–ViewModel) is a layered architecture that separates GUI development from business logic:

- **Model**: the domain model or the data access layer.
- **View**: the structure and appearance; it receives user actions.
- **ViewModel**: an abstraction of the view: it exposes properties and commands and contains almost all the presentation logic. It does not hold a reference to the View.

The View is bound to the ViewModel's properties through binding.

