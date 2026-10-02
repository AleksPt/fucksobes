---
title: "What is UIStoryboardSegue? How are segues handled? What alternatives are there?"
category: uikit
order: 81
---

`UIStoryboardSegue` is an object that describes a transition between two view controllers defined in a Storyboard (push, modal, show, etc.). It can be triggered by an action on an element (a button tap) or programmatically via `performSegue(withIdentifier:sender:)`.

Handling: before the transition, the system calls `prepare(for:sender:)` on the source controller, where you compare `segue.identifier`, cast `segue.destination` to the needed type and pass data. To decide whether to allow the transition, override `shouldPerformSegue(withIdentifier:sender:)`.

The alternative is to create the controller in code and present it (`navigationController?.pushViewController`, `present`). This is more type-safe and makes it easier to pass dependencies through the initializer. Segues rely on string identifiers, so typos are found only at runtime, and data is passed through optional properties, which is why teams often drop them in favor of code and coordinators.
