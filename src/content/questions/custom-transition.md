---
title: "Как можно реализовать кастомную анимацию перехода между двумя экранами?"
category: uikit
order: 87
---

Для этого нужны два объекта:

1. **Аниматор**, реализующий `UIViewControllerAnimatedTransitioning`: метод `transitionDuration(using:)` возвращает длительность, а `animateTransition(using:)` выполняет анимацию. Из контекста берут `containerView` (в неё надо самому добавить отображаемый view) и исходный и целевой контроллеры (`viewController(forKey:)`). По окончании обязательно вызывают `transitionContext.completeTransition(true)` или `false`, если переход отменён.
2. **Делегат перехода**, который возвращает аниматор:
   - для модального показа: `transitioningDelegate` контроллера (`UIViewControllerTransitioningDelegate`) с `modalPresentationStyle = .custom` или `.fullScreen`; методы `animationController(forPresented:...)` и `animationController(forDismissed:)`;
   - для `UINavigationController`: `UINavigationControllerDelegate` и метод `animationControllerFor:from:to:`.

Для интерактивных переходов (жестом) дополнительно возвращают `UIPercentDrivenInteractiveTransition` и управляют прогрессом через `update`, `finish`, `cancel`. Для нестандартной формы модального окна используют `UIPresentationController`.
