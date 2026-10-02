---
title: "If we haven't found any responder that can handle the event, what happens?"
category: uikit
order: 57
---

1. **Passing the event to `UIWindow`.** If no `UIView` was able to handle the event, it is passed back to the `UIWindow`. The window can handle it itself if it overrides the relevant methods, for example `touchesBegan(_:with:)`.
2. **Passing it to `UIApplication`.** If the `UIWindow` did not handle the event, it is passed to the next link in the chain, `UIApplication`.
3. **Ignoring.** If `UIApplication` did not handle it either, the event is simply **ignored**, and the interaction ends without any action.
