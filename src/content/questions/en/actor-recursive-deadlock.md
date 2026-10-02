---
title: "How do you ensure the order of task execution in an actor, and why can it hang?"
category: concurrency
order: 115
---

An actor is a serial executor (an isolated context) that handles calls one at a time: all requests to its isolated methods go into the actor's queue, but the order in which they actually execute is not always intuitive, especially where methods contain an `await` at which the actor can switch to handling another request (see reentrancy).

One typical hang scenario is an actor recursively calling itself through `await` when there is no way to make progress between the call and its completion:

```swift
actor Logger {
    func log(_ message: String) async {
        await flush() // suspension point
        print(message)
    }

    func flush() async {
        await log("flushing") // recursive call → infinite loop
    }
}
```

Here `log` waits for `flush`, and `flush` calls `log` again. Tasks are queued on the actor one after another, none of them completes, and the result is an effective hang (not a classic deadlock in the sense of a blocked thread, but an endlessly growing queue of tasks waiting for each other).

How to debug it:

- use `OSSignpost` or `os_log` with timestamps to see the order in which actor methods are entered and exited;
- log entry and exit in every actor method, especially around `await`, to see where the call chain loops back on itself.

Best practices:

- avoid `await` between reading and writing state inside an actor: short synchronous methods without `await` run atomically, and reentrancy has no chance to interfere;
- separate responsibilities: the actor stores data and encapsulates business logic, while an external `Service`/`ViewModel` manages the order of calls to its methods, instead of the actor recursively calling itself.

```swift
actor Bank {
    private var balance = 0

    func withdraw(amount: Int) {
        balance -= amount
    }

    func getBalance() -> Int {
        balance
    }
}
```

Both methods here are synchronous (no `await` inside), so a call is guaranteed to run from start to finish without interruption, which makes the order easier to reason about and prevents reentrancy.
