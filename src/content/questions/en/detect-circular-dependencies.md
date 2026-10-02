---
title: "How do you find out about circular dependencies between modules?"
category: tooling
order: 49
---

The most direct way is simply to try building the project: Xcode and SPM **refuse to build** a target graph with a cycle (A imports B, and B imports A), reporting a dependency error at build time. This is a reliable but late signal: the cycle is only discovered when you have run into it by hand.

To find and check for cycles earlier and deliberately, rather than after the fact:

- **`swift package show-dependencies`** prints an SPM package's dependency tree as text, as JSON (`--format json`) or in `dot` format (`--format dot`) for visualization as a graph with Graphviz. The graph shows if some branch unexpectedly points back to the root.
- **Modular-architecture tools** (for example, `tuist graph` in Tuist) build a visual graph of the dependencies of all of the project's modules and explicitly highlight cycles, if such a check is built into the tool.
- **Manual audit of import rules.** In modular projects the allowed direction of dependencies between layers is defined in advance (for example, `Core` must not import anything from `Features`), and import linters or CI scripts that compare the actual `import`s in the code with a list of allowed ones catch a potential cycle before it gets into the target graph.
- **Code review of module boundaries.** When a new `import` is added to a module, explicitly check whether it creates a dependency in the opposite direction to an existing one.

The best strategy is not to fight cycles after the fact, but to design modules in layers with one-way dependencies from the start (for example, move shared code into a separate base module that the others depend on, rather than on each other), so that a cycle has nowhere to come from.
