---
title: "What is NSLayoutAnchor?"
category: uikit
order: 155
---

`NSLayoutAnchor` is a factory class that provides a convenient, type-safe API for creating Auto Layout constraints programmatically, instead of the cumbersome `NSLayoutConstraint(item:attribute:relatedBy:toItem:attribute:multiplier:constant:)`.

`NSLayoutAnchor` has three specialized subclasses, each responsible for its own constraint "axis" and preventing you from accidentally linking incompatible attributes (for example, the compiler will not let you connect a horizontal anchor to a vertical one):

- **`NSLayoutXAxisAnchor`**: horizontal constraints: `leadingAnchor`, `trailingAnchor`, `centerXAnchor`;
- **`NSLayoutYAxisAnchor`**: vertical constraints: `topAnchor`, `bottomAnchor`, `centerYAnchor`;
- **`NSLayoutDimension`**: sizes: `widthAnchor`, `heightAnchor`.

Every `UIView` (and `UILayoutGuide` too) has these anchors as properties. A constraint is created with a method such as `constraint(equalTo:)` or `constraint(greaterThanOrEqualTo:constant:)`, and activated via `isActive = true` or `NSLayoutConstraint.activate([...])`.

```swift
NSLayoutConstraint.activate([
    subview.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
    subview.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
    subview.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
    subview.heightAnchor.constraint(equalToConstant: 44)
])
```

In practice the `NSLayoutAnchor` class itself is almost never used directly: you work with its subclasses through the anchor properties, and it serves as a common base type providing a uniform API (`constraint(equalTo:)` and other methods) for all three axes. Don't forget to set `translatesAutoresizingMaskIntoConstraints = false` on a view whose constraints you set manually, otherwise the constraints automatically generated from `autoresizingMask` will conflict with the ones you add.
