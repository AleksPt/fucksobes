---
title: "What is actor reentrancy and what problems does it cause?"
category: concurrency
order: 111
---

**Reentrancy** is the property of an actor that lets it interrupt the current request at an `await` point to handle another incoming request, then return and continue the original one. This is not a bug but a deliberate design decision of Swift Concurrency: without it, a single stuck `await` inside an actor would block all access to it, including unrelated requests.

Each `actor` isolates its state and handles requests one at a time (internally, usually a serial queue), but at an `await` point the actor **may** switch to another request without waiting for the current one to finish.

```swift
actor BankAccount {
    var balance: Int = 0

    func withdraw(_ amount: Int) async {
        if balance >= amount {
            await notifyExternalSystem() // suspension point: the actor may go handle another request
            balance -= amount            // balance may already have been changed by another call!
        }
    }
}
```

The problem: between the check `balance >= amount` and the following `balance -= amount`, another `withdraw` call may have run and changed `balance`. This is the classic TOCTOU (time-of-check to time-of-use), even though the actor does protect against data races at the memory level.

How to avoid it:

- minimize `await` inside actor methods, especially between reading and then modifying state;
- move side effects (network calls, notifications, UI) outside the actor method: the actor should only store data and encapsulate business logic;
- split the method into a "pure" part without `await` (checking and changing state in one piece) and a "dirty" part with side effects that is called from outside:

```swift
func withdraw(_ amount: Int) -> Bool {
    guard balance >= amount else { return false }
    balance -= amount   // the whole synchronous block runs without interruption
    return true
}

// called outside the actor
if await account.withdraw(100) {
    await notifyExternalSystem()
}
```

Such a synchronous actor method (with no `await` inside) runs atomically from start to finish: reentrancy simply has no chance to interfere, because there is no suspension point where the actor could switch.
