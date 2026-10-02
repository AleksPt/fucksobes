---
title: "Возможно ли сделать навигацию по SwiftUI-приложению без использования NavigationView, NavigationLink и UINavigationController? Если да — приведите пример архитектуры"
category: swiftui
order: 53
---

Да, возможно — навигация в SwiftUI, по сути, это просто отображение разных view в зависимости от состояния, а `NavigationStack`/`NavigationLink` — лишь один (удобный) способ этим состоянием управлять.

Альтернатива — **собственный роутер (координатор)**, который хранит стек экранов как значение состояния, а сама навигация реализуется через условный рендеринг (`ZStack`/`switch`) поверх этого состояния:

```swift
enum Route: Hashable {
    case home
    case details(id: Int)
    case settings
}

@Observable
final class Router {
    var stack: [Route] = [.home]

    func push(_ route: Route) { stack.append(route) }
    func pop() { if stack.count > 1 { stack.removeLast() } }
}

struct RootView: View {
    @State private var router = Router()

    var body: some View {
        ZStack {
            switch router.stack.last {
            case .home:
                HomeView(router: router)
            case .details(let id):
                DetailsView(id: id, router: router)
            case .settings:
                SettingsView(router: router)
            case nil:
                EmptyView()
            }
        }
        .transition(.move(edge: .trailing)) // анимация переходов вручную
        .animation(.default, value: router.stack)
    }
}
```

Переходы между экранами при этом делают вручную — через `.transition` и `withAnimation` при изменении верхушки стека, вместо системной push/pop-анимации `UINavigationController`.

Такой подход даёт:

- полный контроль над анимацией переходов, жестами возврата и внешним видом — не ограничен системным `NavigationController`;
- тестируемость навигации отдельно от view (роутер — обычный объект, стек — обычный массив, который легко проверить в unit-тестах);
- единую точку принятия решений о переходах (координатор/роутер), что удобно в модульных архитектурах (например, VIPER или Clean Architecture с отдельным слоем координаторов).

Минусы — приходится вручную реализовывать то, что `NavigationStack` даёт бесплатно: системные жесты возврата (свайп с края), анимации по гайдлайнам Apple, интеграцию с `deep link`/state restoration и поддержку `NavigationPath`.
