---
title: "What criteria do you use to choose an architecture when developing an app or a feature?"
category: architecture
order: 42
---

There is no universally right answer: you choose the architecture to fit the task, not the other way around. The main criteria:

- **project size and lifespan**: simple MVC/MVVM is enough for a prototype, while a large, long-lived product needs modularity and clear boundaries;
- **the team**: how many people work on the code, whether they know the architecture, and whether there are agreed conventions and code review;
- **the UI framework**: SwiftUI and UIKit suggest different approaches (MVVM, unidirectional flows, coordinators);
- **testability**: the ability to verify logic without the UI;
- **complexity of state and navigation**: the more complex they are, the more valuable explicit state management and separate routing become;
- **development speed** and maintenance cost: extra layers and boilerplate slow the team down;
- **reuse and modularity requirements**.

In practice, you start with a simple option and make the structure more complex when real problems appear.
