---
title: "When the user touches the screen, who receives the touch event first? How is it handled?"
category: uikit
order: 56
---

1. The user touches the screen, the system creates an event, and **`UIApplication`** receives it first.
2. It is passed to the **`UIWindow`**.
3. `UIWindow` calls `hitTest(_:with:)` and performs **hit-testing**: a recursive search for a suitable view via `point(inside:with:)`.
4. The view that is found handles the event through the touch methods or passes it further along the responder chain. If nobody handles it, the event is ignored.
