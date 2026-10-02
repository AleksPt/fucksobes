---
title: "What is a race condition? How can it be solved?"
category: concurrency
order: 47
---

A **race condition** is a situation in which two or more threads access shared data or resources at the same time without proper synchronization and try to modify them. The expected order of operations becomes unpredictable, so the intended logic suffers and the program may behave incorrectly.

**How to solve it:** serial queues, `NSLock`, thread-safe data structures (`actor`).
