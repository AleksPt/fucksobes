---
title: "What is MVP? What does it consist of?"
category: architecture
order: 38
---

MVP (Model–View–Presenter) is a variation of MVC in which the intermediary (the Presenter) is completely separated from the UI:

- `Model`: data and business logic;
- `View`: a passive interface: it shows what it is told to show and passes user actions to the presenter; in iOS this is the `UIViewController` together with its view;
- `Presenter`: contains the presentation logic: it receives events from the View, talks to the Model, formats data, and tells the View what to show.

The View and the Presenter communicate through protocols: the Presenter holds a reference to the View protocol, and the View holds a reference to the Presenter. Thanks to this, the presenter's logic can be tested without UIKit, and the view controller stays thin. Con: a lot of boilerplate and protocols, and the Presenter updates the View manually.
