---
title: "How are UI events (a tap, scrolling) handled in the run loop?"
category: uikit
order: 132
---

1. The system handles the touch: an event from the sensor becomes an HID event and is passed to the app through a Mach port (a run loop event source).
2. The main run loop wakes up, receives the event through the input source and passes it to `UIApplication`, which builds a `UIEvent` with a list of touches (`UITouch`) and calls `sendEvent(_:)`.
3. The window (`UIWindow`) finds the target view via `hitTest(_:with:)`, and the event goes along the responder chain: `touchesBegan`, `touchesMoved`, `touchesEnded`, as well as gestures (`UIGestureRecognizer`) and `UIControl` actions.
4. The handlers change state, views are marked as needing layout or drawing, and at the end of the run loop iteration Core Animation performs layout and commit.

During scrolling, the run loop switches from the `default` mode to `tracking`: priority goes to rendering and touch events, while timers and other sources added only to `default` do not fire. To make them work during scrolling too, they are added in the `common` mode. If an event handler runs for a long time, the run loop cannot update the screen in time.
