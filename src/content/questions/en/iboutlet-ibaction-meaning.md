---
title: "What do IBOutlet and IBAction mean, what are they for, and what do they mean for the preprocessor?"
category: uikit
order: 153
---

Both are attributes that connect code to Interface Builder (the visual editor for storyboards and xibs).

- **`@IBOutlet`** marks a property as an "outlet" into which Interface Builder can plug a UI element drawn on the canvas. Once connected, the system itself assigns the property a reference to the created element when the view is loaded.

```swift
@IBOutlet weak var titleLabel: UILabel!
```

- **`@IBAction`** marks a method as an action handler that can be bound to a control's event (a button tap, a slider value change) right in Interface Builder by dragging a connection from the element to the method.

```swift
@IBAction func didTapButton(_ sender: UIButton) { ... }
```

For the language and the compiler, these attributes **change nothing** in the behavior of the code: from the runtime's point of view it is an ordinary property and an ordinary method. Their only role is to be a **marker for Interface Builder**: it statically analyzes the source code, finds all the `@IBOutlet`/`@IBAction` declarations and uses them to show in the editor the points that can be connected to elements on the canvas (the circles for dragging connections). Historically, back in the Objective-C days, `IBOutlet` and `IBAction` were just empty preprocessor macros (`#define IBOutlet` expanded to nothing): they existed solely so that Interface Builder could find them when parsing the sources, not for the compiler or the runtime.
