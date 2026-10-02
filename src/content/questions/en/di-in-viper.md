---
title: "What is Dependency Injection and where is it used in VIPER?"
category: architecture
order: 66
---

Dependency Injection is a technique in which an object does not create its dependencies itself but receives them from outside (through an initializer, a property, or a method). This way the object depends on protocols rather than on concrete implementations, and it can be tested with substituted dependencies.

In VIPER (View, Interactor, Presenter, Entity, Router), a module consists of several objects that must know about each other through protocols:

- View → Presenter (UI events), Presenter → View (screen updates);
- Presenter → Interactor (business logic), Interactor → Presenter (the result);
- Presenter → Router (navigation);
- Interactor → services (networking, database).

Dependencies are injected in two places:

1. **When the module is assembled.** This is usually done by an `Assembly`/`Builder` (often also the module's composition root): it creates all the parts, connects them, and returns a ready `UIViewController`. The parts receive each other through an initializer or properties, and the back references (for example, `view` in the presenter) are made `weak` to avoid a retain cycle.
2. **For services.** The Interactor accepts service protocols (`NetworkClient`, `Storage`) through `init`, and their implementations come from a shared DI container or from the parent assembly.

```swift
enum ProfileAssembly {
    static func build(container: Container) -> UIViewController {
        let view = ProfileViewController()
        let interactor = ProfileInteractor(api: container.resolve(ProfileAPI.self))
        let router = ProfileRouter(viewController: view)
        let presenter = ProfilePresenter(view: view, interactor: interactor, router: router)
        view.presenter = presenter
        interactor.output = presenter
        return view
    }
}
```
