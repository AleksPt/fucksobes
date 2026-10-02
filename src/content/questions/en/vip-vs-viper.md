---
title: "What parts does VIP (Clean Swift) consist of? How does it differ from VIPER?"
category: architecture
order: 55
---

VIP is the Clean Swift architecture (Raymond Law): a module (a scene) consists of a View (`UIViewController`), an Interactor, a Presenter, as well as a Router and a Worker. Its main feature is a unidirectional cycle:

**View → Interactor → Presenter → View**

- the View receives user actions and sends a `Request` to the Interactor;
- the Interactor performs the business logic (through a Worker: network, database) and passes a `Response` to the Presenter;
- the Presenter formats the data into a `ViewModel` and hands it to the View for display;
- the Router is responsible for navigation and passing data between scenes.

Differences from VIPER:

- in VIPER, the Presenter sits in the middle and communicates with the View, the Interactor, and the Router in both directions, while in VIP the connections form a closed one-way cycle and the Interactor does not depend on the Presenter directly;
- VIP has no separate Entity layer (models are passed as `Request/Response/ViewModel` for each scenario), and the data-handling logic is moved into Workers;
- VIP separates data between layers more strictly but requires even more boilerplate.
