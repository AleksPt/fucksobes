---
title: "Что такое Dependency Injection и где он используется в VIPER?"
category: architecture
order: 66
---

Dependency Injection — приём, при котором объект не создаёт свои зависимости сам, а получает их снаружи (через инициализатор, свойство или метод). Так объект зависит от протоколов, а не от конкретных реализаций, и его можно тестировать с подменёнными зависимостями.

В VIPER (View, Interactor, Presenter, Entity, Router) модуль состоит из нескольких объектов, которые должны знать друг о друге через протоколы:

- View → Presenter (события UI), Presenter → View (обновление экрана);
- Presenter → Interactor (бизнес-логика), Interactor → Presenter (результат);
- Presenter → Router (навигация);
- Interactor → сервисы (сеть, база данных).

Зависимости внедряются в двух местах:

1. **При сборке модуля.** Этим занимается `Assembly`/`Builder` (часто он же — composition root модуля) либо, как в классическом VIPER, сам `Router` (Wireframe); допустимы оба варианта. Сборщик создаёт все части, связывает их и отдаёт готовый `UIViewController`. Между собой части получают друг друга через инициализатор или свойства, а обратные ссылки (например, `view` у presenter) делают `weak`, чтобы не было retain cycle.
2. **Для сервисов.** Interactor принимает через `init` протоколы сервисов (`NetworkClient`, `Storage`), а их реализации приходят из общего DI-контейнера или из родительской сборки.

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
