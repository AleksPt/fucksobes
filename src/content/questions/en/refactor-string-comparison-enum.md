---
title: "What improvements can you suggest for a method with an if-else chain that compares direction strings?"
category: swift
order: 117
---

```swift
func turnTo(direction: String) {
    if direction == "North" { northAction() }
    else if direction == "East" { eastAction() }
    else if direction == "South" { southAction() }
    else if direction == "West" { westAction() }
    else { print("No valid direction specified") }
}
```

Problems: the direction values are "magic strings", a typo will not be caught by the compiler, and an invalid value is handled only at runtime. The improvement is to replace the string with an enum and the `if-else` chain with a `switch`:

```swift
enum Direction { case north, east, south, west }

func turn(to direction: Direction) {
    switch direction {
    case .north: northAction()
    case .east:  eastAction()
    case .south: southAction()
    case .west:  westAction()
    }
}
```

Now only four values are valid, the "invalid value" branch is not needed, and the compiler checks that the `switch` is exhaustive: when a new case is added, it will require you to handle it. If the string comes from outside, an enum with `String` as its raw value converts it through `Direction(rawValue:)` and returns `nil` for unknown values. Case names in Swift are written in lowerCamelCase.
