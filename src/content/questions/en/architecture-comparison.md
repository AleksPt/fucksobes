---
title: "What is the difference between MVC, MVP, MVVM, and VIPER? What other architectural approaches do you know?"
category: architecture
order: 41
---

All four approaches separate business logic from the UI and differ in how the intermediary is structured and how it is connected to the View:

- **MVC**: the Controller manages the View and the Model; in iOS it ends up tightly coupled to `UIViewController`.
- **MVP**: the Presenter does not depend on UIKit and talks to the View through a protocol; the View is passive.
- **MVVM**: the ViewModel knows nothing about the View and exposes state; the View subscribes to it through bindings (Combine, Rx, `@Observable` in SwiftUI).
- **VIPER**: splits the logic into five components (View, Interactor, Presenter, Entity, Router) and separates navigation out on its own.

Other approaches: Clean Architecture (layers and the dependency rule), Redux/TCA and other unidirectional architectures (UDF) with a single state and reducers, RIBs, and coordinators (Coordinator) for navigation. The choice depends on the size of the project, the team, and the UI framework: for SwiftUI, for example, MVVM and unidirectional architectures are a natural fit.
