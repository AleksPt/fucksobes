---
title: "What is the difference between Task and Task.detached?"
category: concurrency
order: 76
---

1. **`Task`** starts a task in the current actor context: it inherits the priority and task-local values of the calling code and can share state with the other tasks of the same actor.
2. **`Task.detached`** starts a task in a separate, independent context: it does not affect the current actor context and does not inherit the state of the parent code. Useful for tasks that do not depend on the state of the surrounding context.
