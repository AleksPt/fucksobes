---
title: "We have a screen; in viewDidLoad we started a long-running task and captured self in its closure, then left the screen. What will happen?"
category: memory
order: 45
---

The user leaves the screen, but `deinit` **will not be called**, because `self` is held by the task.

If you capture `self` in long-running tasks without `[weak self]`, the screen's object stays in memory even after the user has left. This causes a memory leak, so for long-running tasks always use `[weak self]`.
