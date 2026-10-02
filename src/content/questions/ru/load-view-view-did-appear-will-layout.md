---
title: "Что такое LoadView, ViewDidAppear и ViewWillLayoutSubviews?"
category: uikit
order: 28
---

- **`loadView`** — переопределяется, чтобы создавать view в коде вместо использования storyboard.
- **`viewDidAppear`** — вызывается сразу после того, как view controller появился на экране.
- **`viewWillLayoutSubviews`** — вызывается перед тем, как view контроллера разместит свои subviews. Границы окончательно подсчитаны.
