---
title: "What does public private(set) mean? How do fileprivate, private, and internal differ from each other?"
category: swift
order: 135
---

Access levels:

- `private` — the entity is visible only inside its declaration and its extensions in the same file;
- `fileprivate` — visible throughout the file;
- `internal` (default) — visible throughout the module, but not outside it;
- `public` — visible in other modules;
- `open` — like `public`, plus you can subclass and override class members outside the module.

For properties, you can set a separate level for writing: `public private(set) var` means that the value can be read from outside the module but modified only inside the type (and its extensions in the file).

```swift
public struct Counter {
    public private(set) var value = 0
    public mutating func increment() { value += 1 }
}
```

This is how encapsulation is achieved: the owner controls state changes, while outside code can only read. The write level cannot be higher than the read level.
