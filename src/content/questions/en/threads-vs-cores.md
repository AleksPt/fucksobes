---
title: "Is the number of threads always equal to the number of processor cores?"
category: concurrency
order: 4
---

No. In GCD, if a thread blocks while there is still work on a concurrent queue, the system spins up additional threads so that every core has something to do; so there can be significantly more threads than cores (thread explosion).

In Swift Concurrency, the cooperative pool creates no more threads than there are CPU cores: instead of blocking, a thread switches between tasks.
