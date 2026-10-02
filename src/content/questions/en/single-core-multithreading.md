---
title: "How did multithreading work back when processors had a single core?"
category: concurrency
order: 3
---

On single-core processors, multithreading was still possible, but it was based on **time slicing** of the processor between tasks. This is **pseudo-parallelism**: at any moment the processor executes only one instruction, but it switches between tasks so quickly that it creates an illusion of simultaneity.
