---
title: "If we set isUserInteractionEnabled = false on a view, it becomes false for itself and for all its subviews. Is there any way to outsmart the system and teach the view to handle events while user interaction is disabled?"
category: uikit
order: 59
---

Yes, it can be done:

- **Override `hitTest(_:with:)`** in the parent view to redirect events to subviews, ignoring `isUserInteractionEnabled`, and manually return the needed subview that should handle the event.
- **Use `UIGestureRecognizer`.** Gestures work independently of `isUserInteractionEnabled` if they are attached to specific subviews.
- Create an overlay view to capture events.
- Set `isUserInteractionEnabled = true` for specific subviews.
