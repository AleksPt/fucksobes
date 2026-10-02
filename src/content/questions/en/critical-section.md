---
title: "What is a critical section in multithreading?"
category: concurrency
order: 49
---

A critical section is a piece of code that only one thread is allowed to enter at any given time. For example, it modifies some data structure or uses a resource that supports no more than one client at a time.

It is usually protected with a lock (a mutex): the other threads wait until the section is free.
