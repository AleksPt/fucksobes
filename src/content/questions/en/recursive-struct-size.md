---
title: "Why must the size of a struct be known in advance? How do you fix a struct Node with a field next: Node?"
category: swift
order: 146
---

A struct is a value type, and its fields are stored directly inside the value. To allocate space (on the stack, in an array, inside another type), the compiler must know the size of the struct at compile time.

```swift
struct Node {          // error: value type 'Node' cannot have a stored property
    var payload = 0    // that recursively contains it
    var next: Node?
}
```

`Node` contains a `Node?`, which contains another `Node`, and so on, so the size is infinite. Ways to fix it:

- make `Node` a class: the `next` field stores only a reference of fixed size (8 bytes);
- use an `indirect enum` (it stores associated values through a pointer to the heap);
- move the reference into a box class `final class Box<T> { var value: T }` and store `var next: Box<Node>?`;
- store the descendants in an array `[Node]`: the array keeps its buffer on the heap, and the struct holds only a reference.

Usually a class is chosen for linked lists and trees: they naturally have reference semantics.
