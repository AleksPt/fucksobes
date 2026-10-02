---
title: "What is multithreading, and what tools do you know for working with it?"
category: concurrency
order: 1
---

It is a program's ability to run several threads (or tasks) at the same time, which makes efficient use of processor resources.

An app runs on the main thread, and during a resource-intensive process it starts to lag, because everything runs on the main thread. Multithreading solves this problem: "expensive" tasks are sent to a parallel queue, and the main thread is relieved.

Tools: `Thread`, GCD, `Operation`, Swift Concurrency.
