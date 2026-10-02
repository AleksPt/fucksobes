---
title: "What is MVC? What does it consist of? What is wrong with Apple MVC?"
category: architecture
order: 37
---

MVC (Model–View–Controller) divides an app into three roles:

- `Model`: data and business logic;
- `View`: display and user interaction;
- `Controller`: an intermediary that receives actions from the View, updates the Model, and passes the changes to the View.

In Apple MVC, the Controller role is played by `UIViewController`, but it is tightly coupled to the View: it manages the View's lifecycle, layout, and response to events. As a result, network requests, data formatting, navigation, and business logic quickly end up in it, and the controller bloats; this is why the architecture was nicknamed Massive View Controller. Such code is hard to test and reuse.

The problem is usually solved by moving logic out into separate services and models, and by switching to MVP, MVVM, or another architecture.
