---
title: "What problems can we run into in multithreading, and what have you encountered?"
category: concurrency
order: 46
---

1. **Deadlock**: two or more threads wait for each other to release resources they hold, and the wait is endless.
2. **Race condition**: the result of running the code depends on the sequence or timing of thread execution, which can lead to unpredictable results.
3. **Data race**: a special case of a race condition, where several threads simultaneously read and modify data without proper synchronization, which can lead to incorrect data.
4. **Priority inversion**: a low-priority thread acquires a needed resource and delays a higher-priority thread. This can slow down the whole system and lead to a situation similar to a deadlock.
5. **Thread explosion**: creating too many threads overloads thread management and slows things down, because resources go into context switching.
6. **The readers-writers problem**: many threads read data often but modify it rarely. Ordinary mutexes are inefficient here: frequent write locks slow down reading.

Also encountered: **starvation** (thread starvation), **livelock** (active blocking), and **thread safety** as a general problem.
