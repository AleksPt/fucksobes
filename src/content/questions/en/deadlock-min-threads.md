---
title: "What is the minimum number of threads needed for a deadlock to occur?"
category: concurrency
order: 53
---

At minimum **one thread**: a deadlock occurs if you call a **synchronous task (`sync`)** on the same serial queue on which the current task is running.
