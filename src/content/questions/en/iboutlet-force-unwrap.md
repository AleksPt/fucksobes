---
title: "Why is force unwrap used in an IBOutlet?"
category: swift
order: 19
---

An outlet is declared as an implicitly unwrapped optional (`UILabel!`). Such optionals are used when it is clear from the program's structure that the value will always exist after it is first set; then there is no need to check and unwrap it on every access. The main use is during class initialization. They should not be used if the variable can later become `nil` again.

A view controller's view works differently: it is loaded lazily (`loadView()` is called when the `view` property is requested while it is still `nil`), and `viewDidLoad()` is called after the view hierarchy has been loaded into memory, including from a nib. That is, the outlet is populated not in the initializer but later, and after that its value is assumed to always exist.

```swift
class ViewController: UIViewController {
    @IBOutlet var titleLabel: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
        titleLabel.text = "Hello"
    }
}
```
