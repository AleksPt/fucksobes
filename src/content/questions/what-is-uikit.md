---
title: "Что такое UIKit?"
category: uikit
order: 76
---

UIKit — фреймворк Apple для построения интерфейса приложений на iOS, iPadOS и tvOS (а на macOS ту же роль играет AppKit). Он императивный: view создают, настраивают и добавляют в иерархию вручную или в Interface Builder.

Он предоставляет:

- инфраструктуру приложения: `UIApplication`, `UIScene`, `UIWindow`, жизненный цикл;
- иерархию `UIView`, вёрстку через Auto Layout и рисование;
- контроллеры: `UIViewController`, навигацию (`UINavigationController`, `UITabBarController`), списки (`UITableView`, `UICollectionView`);
- обработку событий: касания, жесты, цепочку респондеров;
- анимации (`UIView.animate`) поверх Core Animation, поддержку Dynamic Type, тёмной темы и доступности.

UIKit используется в большинстве существующих приложений. Современная альтернатива — декларативный SwiftUI, но он часто работает совместно с UIKit через `UIViewRepresentable` и `UIHostingController`.
