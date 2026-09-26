---
title: "Как выключить участника из responder chain"
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
