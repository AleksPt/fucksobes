---
title: "How do you exclude a participant from the responder chain?"
category: uikit
order: 48
---

`resignFirstResponder` (?)

```swift
override var canBecomeFirstResponder: Bool {
    return false
}
```

```swift
override var next: UIResponder? {
    return someOtherResponder
}
```
