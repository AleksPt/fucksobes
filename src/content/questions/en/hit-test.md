---
title: "Tell me about the hitTest method"
category: uikit
order: 54
---

`hitTest` is a recursive search through the view hierarchy that determines which view should receive a touch event: the deepest view in the hierarchy under the user's finger. The method checks whether the touch point falls within the bounds of a view or layer (`CALayer`).

**The method is called on the window's root view (or any other view)** when the user touches the screen. It descends the hierarchy from the top level downward and determines which view is under the touch point and can respond to it.

How it works:

- **Checking its own `frame`.** First it checks whether the touch point is inside the bounds of the view being called.
- **Checking `isUserInteractionEnabled` and `isHidden`.** If `isUserInteractionEnabled == false` or `isHidden == true`, the view is skipped: `hitTest` does not return it and it receives no touches (the object itself remains a responder, though, and still has a `next`).
- **Checking `alpha`.** If `alpha` is below a certain threshold (usually 0.01), the view is considered transparent to touches.
- **A recursive call for subviews.** If the view passes all the checks, `hitTest` is called recursively for each subview, starting with the topmost (the last added), until a suitable responder is found or all subviews have been checked.

In the end, `hitTest` returns the view that **is best suited to handle the touch**. If no subview fits, the view being called is returned (if it can respond to the touch); otherwise `nil`.
