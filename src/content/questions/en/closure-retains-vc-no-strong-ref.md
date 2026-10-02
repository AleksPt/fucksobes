---
title: "You have a ViewController and a closure. We closed the ViewController, there are no strong external references to it, but the memory was not freed. Why?"
category: memory
order: 73
---

Because a strong reference to the `ViewController` may be held not *outside* it but *inside* it, through a closure.

The typical cause is a **strong reference cycle** between `self` and an escaping closure:

- the `ViewController` stores a closure somewhere (in a property, in a network request, in a timer, in a notification handler), that is, it holds a strong reference to the closure itself;
- that closure captures `self` without `[weak self]`, that is, it holds a strong reference to the controller.

This produces a cycle: `VC → closure → VC`. Even when all external references (the navigation stack, the presenting controller) are gone, the objects inside the cycle keep each other alive, and ARC cannot free them: `deinit` is not called, and the memory is not returned.

```swift
final class ProfileViewController: UIViewController {
    var onUpdate: (() -> Void)?

    override func viewDidLoad() {
        super.viewDidLoad()
        // Strongly capturing self creates a cycle if onUpdate is stored longer than the VC lives
        onUpdate = {
            self.reload()
        }
    }
}
```

A similar situation arises even without an explicit closure property:

- a long-lived **timer** (`Timer.scheduledTimer`) or **observer** (`NotificationCenter`) that holds a closure with a strong `self` and was not invalidated or unsubscribed;
- a network request with an `escaping` closure that the ViewController did not cancel on close, while `URLSession` itself holds both the request and its completion closure.

The fix is to capture `self` weakly wherever the closure can outlive the object itself:

```swift
onUpdate = { [weak self] in
    self?.reload()
}
```

The **Memory Graph Debugger** in Xcode (it shows the reference cycle between the VC and the closure) and **Instruments → Leaks** help find such leaks.
