---
title: "Concurrency and parallelism: what is the difference? How can you achieve each?"
category: concurrency
order: 6
---

Asynchronous code can be suspended and resumed later, but only one part of it runs at any given moment. Parallel code runs simultaneously: for example, four processor cores run four tasks at once. In Swift's documentation, the term *concurrency* refers to the combination of asynchronous and parallel code.

Asynchrony is achieved through `async`/`await` (suspending at an `await` lets other code run). Parallelism requires multiple cores and running tasks in parallel: for example, a concurrent GCD queue starts several tasks at once.
