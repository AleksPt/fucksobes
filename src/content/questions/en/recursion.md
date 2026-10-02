---
title: "What is recursion? How do you use it correctly, and what are its caveats?"
category: algorithms
order: 25
---

Recursion is a technique where a function calls itself, breaking a problem into simpler subproblems of the same kind. Correct recursion has two mandatory elements: a base case (the exit condition at which the function stops calling itself) and a recursive step that moves the call closer to the base case.

```swift
func factorial(_ n: Int) -> Int {
    n <= 1 ? 1 : n * factorial(n - 1)
}
```

Caveats:

- each call takes a frame on the call stack, so without a base case or with too great a depth the stack overflows and the app crashes;
- recursion usually uses more memory than a loop: O(depth) on the stack versus O(1);
- naive recursion can solve the same subproblems many times (as with Fibonacci numbers); this is fixed with memoization or by rewriting it as a loop;
- Swift does not guarantee tail-call optimization, so you can't rely on it for great depths.

Recursion is convenient for trees, graphs, traversing nested structures and divide-and-conquer algorithms. Any recursion can be replaced by a loop with an explicit stack.
