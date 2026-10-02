---
title: "Is it possible to build navigation in a SwiftUI app without NavigationView, NavigationLink and UINavigationController? If so, give an example of the architecture"
category: swiftui
order: 53
---

Yes — navigation in SwiftUI is essentially just displaying different views depending on state, and `NavigationStack`/`NavigationLink` is only one (convenient) way to manage that state.

The alternative is a **custom router (coordinator)** that stores the screen stack as a state value, while the navigation itself is implemented through conditional rendering (`ZStack`/`switch`) on top of that state:

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
                    .transition(.move(edge: .trailing)) // the transition is set on the screens themselves
            case .details(let id):
                DetailsView(id: id, router: router)
                    .transition(.move(edge: .trailing))
            case .settings:
                SettingsView(router: router)
                    .transition(.move(edge: .trailing))
            case nil:
                EmptyView()
            }
        }
        .animation(.default, value: router.stack) // animation of screen changes
    }
}
```

Transitions between screens are done manually here — with `.transition` on the screens themselves (on the `ZStack` it won't work: the container is neither inserted nor removed) and an animation when the top of the stack changes (`withAnimation` or `.animation(_:value:)`) — instead of the system push/pop animation of `UINavigationController`.

This approach gives you:

- full control over transition animations, back gestures and appearance — you are not limited by the system `NavigationController`;
- navigation that can be tested separately from views (the router is an ordinary object, the stack is an ordinary array that is easy to check in unit tests);
- a single place where navigation decisions are made (coordinator/router), which is convenient in modular architectures (for example, VIPER or Clean Architecture with a dedicated coordinator layer).

The downsides: you have to implement by hand what `NavigationStack` gives you for free — system back gestures (edge swipe), animations that follow Apple's guidelines, integration with `deep link`/state restoration, and `NavigationPath` support.
