---
title: "Router and Coordinator: what is the difference?"
category: architecture
order: 57
---

Both are responsible for navigation and take it out of view controllers, but they differ in scale.

A **Router** (for example, in VIPER) is tied to a single module: it knows how to show the next screen from the current one (assemble the module and perform a `push`/`present`) and how to pass data to it. Each module has its own Router, and it usually decides where to go when an action happens on that screen.

A **Coordinator** manages a whole flow of several screens: onboarding, authorization, checkout. It owns the `UINavigationController`, creates the screens and their dependencies, knows the order of transitions, and communicates with child coordinators; the screens' controllers don't know about each other and only report events to the coordinator (through a delegate or a closure). Coordinators form a tree.

In short: a Router handles the navigation of one screen, and a Coordinator manages the flow of screens and the assembly of their dependencies. In practice the terms are often mixed up and the approaches are used together: a Coordinator for flows, a Router for transitions within a module.
