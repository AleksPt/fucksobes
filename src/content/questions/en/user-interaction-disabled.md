---
title: "If we set isUserInteractionEnabled = false on a view, it and all its subviews stop receiving touches. Is there any way to outsmart the system and teach the view to handle events while user interaction is disabled?"
category: uikit
order: 59
---

Yes, it can be done:

- **Override `hitTest(_:with:)`** in the parent view to redirect events to subviews, ignoring `isUserInteractionEnabled`, and manually return the needed subview that should handle the event.
- **Attach a `UIGestureRecognizer` to an enabled parent.** A gesture on the view with disabled interaction itself will not fire (it does not pass hit-testing), but touches in its area go to the parent, and the parent's recognizer receives them.
- Create an overlay view to capture events.
- Set `isUserInteractionEnabled = true` for specific subviews.
