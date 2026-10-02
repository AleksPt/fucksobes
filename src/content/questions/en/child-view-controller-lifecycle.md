---
title: "What is the order of lifecycle method calls for child controllers in a custom container?"
category: uikit
order: 113
---

When adding a child controller to your own container, the order is as follows:

```swift
addChild(child)                       // 1. tell the container about the child (calls willMove(toParent:))
view.addSubview(child.view)           // 2. add the view and set up the layout
child.didMove(toParent: self)         // 3. tell the child that the transition is complete
```

When removing, the order is reversed:

```swift
child.willMove(toParent: nil)
child.view.removeFromSuperview()
child.removeFromParent()              // will call didMove(toParent: nil)
```

The container forwards appearance events (`viewWillAppear`, `viewDidAppear`, and so on) to its children automatically. If you need to manage this manually (for example, when replacing one child controller with another with an animation), override `shouldAutomaticallyForwardAppearanceMethods` and call `child.beginAppearanceTransition(_:animated:)` and `child.endAppearanceTransition()` yourself: the first sends `viewWillAppear/viewWillDisappear`, the second sends `viewDidAppear/viewDidDisappear`.
