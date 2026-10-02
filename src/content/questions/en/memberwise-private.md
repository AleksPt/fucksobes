---
title: "Why can't you call the memberwise initializer if a struct has at least one private property?"
category: swift
order: 106
---

For a struct, the compiler automatically creates a memberwise initializer: it takes one parameter for each stored property and assigns their values directly. The access level of this initializer is no higher than that of the most restricted of the properties.

```swift
struct User {
    private let id: Int
}

let user = User(id: 1)   // error: the initializer is inaccessible due to private protection level
```

If the initializer stayed open, it could be used to set the value of a `private` property from outside the type, which would break encapsulation. So the initializer also becomes `private` (that is, visible only inside the type and its extensions in the same file), and it cannot be called from anywhere else.

The solution is to write your own initializer: it can be `internal` or `public` and set the private values itself. A property declared as `private var` with a default value does not make it into the memberwise initializer.
