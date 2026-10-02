---
title: "What is the Memory Graph?"
category: tooling
order: 23
---

The Memory Graph Debugger is an Xcode tool for analyzing objects in the memory of a running app. It is enabled with the **Debug Memory Graph** button on the debug bar: Xcode takes a snapshot of the heap and shows all live objects and the references between them as a graph.

It helps to:

- find memory leaks: objects that remain on the heap although nothing references them (marked with an exclamation mark in the navigator);
- detect retain cycles: the graph shows which objects keep each other alive;
- understand exactly who is holding an object and see the kind of reference (strong, weak, unowned);
- see the number of instances of types, for example how many view controllers are left after screens were dismissed.

To see the stacks where objects were created, enable **Malloc Stack Logging**. For deeper profiling (allocation dynamics, memory growth), use Instruments (Allocations, Leaks).
