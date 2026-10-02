---
title: "Grand Central Dispatch"
order: 2
---

> **What you'll learn**
>
> - What GCD is and why we work with queues rather than threads
> - Serial and concurrent queues, main and global
> - sync and async — who waits for whom
> - Quality of Service (QoS) priorities
> - DispatchWorkItem, DispatchGroup, asyncAfter, concurrentPerform, DispatchSource
> - When to use GCD and when OperationQueue

> **Prerequisites:** [tutorial 01](../concurrency-basics/) — process, thread, main thread, context switch.

## Analogy: the order rail in a kitchen

You no longer hire the cooks yourself. You simply put **orders** (closure tasks) on a **rail** (a queue). The kitchen's head manager (GCD) decides which cook (a thread from the pool) gets the order and when.

- **Serial rail** — orders are cooked strictly one at a time: the next one is started only when the previous one is finished.
- **Concurrent rail** — orders are taken in order, but several cooks prepare them at the same time, and they may be ready in any order.
- **The main rail (main)** — one special rail, served only by the chef at the pass (the main thread): only he serves dishes to guests (updates the UI).

## Step 1. What GCD is

> **Grand Central Dispatch (Dispatch)** is Apple's framework for asynchronous task execution. It takes over creating and managing threads and schedules tasks depending on system load.

- GCD works **at the system level**, so it accounts for the needs of all apps on the device and distributes resources efficiently.
- It is written in C (low-level), but since Swift 3 it has a convenient Swift API.
- Available on iOS, macOS, watchOS, tvOS.
- GCD **doesn't use direct Thread commands**. Thread management (including creation) happens through **queues**. Queues are the foundation of GCD.
- A thread pool is easier to manage, inspect and control than a set of separate unrelated threads.

![Three columns from left to right: your code (tasks 1, 2, 3), DispatchQueue queues (main serial, global concurrent, custom serial or concurrent) and a thread pool managed by the system (the main thread and three Threads). Task 1 goes to main, task 2 to global, task 3 to custom. Main hands the work to the main thread, global to two threads, custom to one thread.](../../../../assets/tutorials/en/concurrency/02-gcd-architecture.svg)

**Core GCD concepts:**

| Concept | Swift type | Meaning |
| --- | --- | --- |
| Task | a closure or `DispatchWorkItem` | The work that needs to be done |
| Queue | `DispatchQueue` | An object that manages running tasks on the main or a background thread. Works as FIFO |
| Dispatch method | `sync` / `async` | Whether we wait for the task to finish at this point in the code |

## Step 2. A queue is FIFO

A **queue** is an entity that runs incoming tasks on one or several threads. Like a line at a cinema, except it holds closures: whoever stood in line first is sent to execution first (**First In, First Out**).

> FIFO guarantees the **order of starting**, not the order of finishing. The order of finishing depends on how long the tasks take and on the queue type.

**How does a queue differ from a thread?** A thread is a "worker" that executes instructions one after another. A task in a queue is a piece of work that must be executed *on some* thread. When exactly and on which thread is decided by the system, depending on load and the queue's properties. A queue spares you the details: you don't have to think about creating threads, how many there are, or balancing the load.

## Step 3. Serial and Concurrent queues

```swift
// Serial — the default
let serialQueue = DispatchQueue(label: "com.example.serial")

// Concurrent
let concurrentQueue = DispatchQueue(label: "com.example.concurrent", attributes: .concurrent)
```

> It is customary to put a reverse domain name in `label` (`com.company.app.purpose`) — that makes the queue easy to find in the call stack and in the debugger.

**Serial** — the system "pulls" a task from the top of the queue and runs it to the end, and only then takes the next one.

- **One** task runs at any moment.
- Can serve as a means of synchronization (more in [tutorial 04](../thread-safety-synchronization/)).
- Examples: private queues by default, `DispatchQueue.main`.

**Concurrent** — the system takes a task from the top and starts it on a thread; if resources are still available, it immediately takes the next one and starts it on another thread while the first is still running.

- Tasks **start** in queue order, but **finish** in any order.
- There is no guarantee that the system will provide more than one thread — only the possibility.
- Examples: private `.concurrent` queues, the global queues `DispatchQueue.global(...)`.

![Two timelines from 0 to 11. Serial: Task 0 from 0 to 3, Task 1 from 3 to 5, Task 2 from 5 to 9, Task 3 from 9 to 11, strictly one after another. Concurrent: Task 0 from 0 to 6, Task 1 from 1 to 4, Task 2 from 2 to 9, Task 3 from 3 to 5, the tasks overlap; they start in order and finish in any order.](../../../../assets/tutorials/en/concurrency/02-serial-concurrent.svg)

## Step 4. The main and global queues

GCD provides ready-made system queues:

```swift
let mainQueue = DispatchQueue.main        // main, serial, tied to the main thread
let globalDefault = DispatchQueue.global() // global concurrent, QoS .default
let userInteractive = DispatchQueue.global(qos: .userInteractive)
let userInitiated = DispatchQueue.global(qos: .userInitiated)
let utility = DispatchQueue.global(qos: .utility)
let background = DispatchQueue.global(qos: .background)
```

**The main queue** serves the main event loop (RunLoop): it reacts to events and updates the UI. Every UI change must run here, and every long operation on it makes the interface less responsive.

**Global queues** are predefined concurrent queues with different priorities (QoS). They are for background tasks: loading a large image, calling an API, parsing.

## Step 5. sync and async

Once a task is placed on a queue, there is only one difference: **whether the current code waits for it to finish**.

- `queue.sync { }` — we put the task on the queue and **wait** for it to run. The current thread is blocked until the task finishes.
- `queue.async { }` — we put the task on the queue and **move on immediately**. The current thread is not blocked.

```swift
let queue = DispatchQueue(label: "queue")

// sync: control returns only after the task finishes
queue.sync { print("This runs first") }
print("Then this")

// async: control returns immediately
queue.async { print("Then this") }
print("This runs first")
```

![A sequence diagram for queue1 (the current one) and queue2. Queue1 runs tasks 1 and 2. The sync block: queue1 calls queue2.sync with task 3, is blocked and waits, queue2 replies that task 3 is done. Then task 4 in queue1. The async block: queue1 calls queue2.async with task 3 and immediately runs task 4, while task 3 goes to queue2 in parallel.](../../../../assets/tutorials/en/concurrency/02-sync-async.svg)

> `sync` / `async` is about the **current** thread (do we wait or not). `serial` / `concurrent` is about the **destination queue** (how many tasks it runs at once). These are two independent axes: there is async on a serial queue, sync on a concurrent one, and so on.

## Step 6. The main pattern: background → main

```swift
DispatchQueue.global(qos: .userInitiated).async {
    let result = performHeavyTask()          // the heavy part — in the background
    DispatchQueue.main.async {
        updateUIWithResult(result)           // UI — only on main
    }
}
```

For example, the request for a list of movies runs in the background; when the response has arrived and been parsed, we switch to the main queue and update the table.

## Step 7. Quality of Service (QoS)

QoS is a task's priority. It affects how much processor time, I/O and energy the system gives the task.

| QoS | What it's for | Example | Duration |
| --- | --- | --- | --- |
| `.userInteractive` | The user is interacting right now, an instant result is needed | Animations, interface calculations, gesture handling | Instant |
| `.userInitiated` | The user started the task from the UI and is waiting for the result | Opening a document, reading from the DB on a tap | An instant — a couple of seconds |
| `.default` | In between userInitiated and utility; "no QoS information". Usually not chosen directly | `DispatchQueue.global()` with no argument | — |
| `.utility` | Long tasks whose progress the user can see; a balance of responsiveness and energy | Networking, import, loading maps with an indicator | Seconds — minutes |
| `.background` | The user neither sees nor waits for it | Backup, indexing, prefetching, synchronization | Minutes — hours |
| `.unspecified` | No QoS; supports legacy APIs | Not used | — |

**Priority escalation.** If a high-priority task waits for the result of a low-priority one (for example, does a `sync` onto its queue), the system may temporarily raise the QoS of the task being waited on — this partially protects against priority inversion (see [tutorial 03](../concurrency-problems/)).

## Step 8. DispatchWorkItem — a task as an object

`DispatchWorkItem` is a more object-oriented alternative to a plain closure. Unlike a closure, it can:

- specify **QoS** and **flags** (`DispatchWorkItemFlags`, for example `.barrier`);
- **notify** another queue on completion — `notify(queue:)`;
- **cancel itself** while it hasn't been picked up yet — `cancel()`.

```swift
let queue = DispatchQueue(label: "queue")
let workItem = DispatchWorkItem { print("Task") }

workItem.notify(queue: .main) { print("Task completed") }
queue.async(execute: workItem)
// Task
// Task completed
```

A harder task (an example from notes). What will be printed?

```swift
func run() {
    let queue = DispatchQueue(label: "SwiftBook.Example.Queue")   // serial
    let item1 = DispatchWorkItem { print("Task1") }
    let item2 = DispatchWorkItem(qos: .background) { print("Task2") }

    item1.notify(queue: queue) { print("finish1") }
    item2.notify(queue: queue) { print("finish2") }

    queue.async { sleep(1) }             // the queue is busy for 1 second
    queue.async(execute: item1)
    queue.async(execute: item2)
    item1.cancel()                       // item1 hasn't started yet — cancel it
}
// Task2
// finish1
// finish2
```

<details>
<summary>Why is that?</summary>

`item1` is cancelled before it starts, so its body (`print("Task1")`) won't run. But cancellation doesn't cancel `notify`: when the queue gets to `item1`, it "finishes" instantly, and `finish1` goes to the end of the queue — already **after** `item2`. Then `item2` runs → `Task2`, then `finish1`, then `finish2`. You can only cancel a task that hasn't started executing; `cancel()` won't stop one that is already running — inside it you have to check `isCancelled`.

</details>

**Delayed start** — `asyncAfter`:

```swift
let item = DispatchWorkItem { print("Search for the query") }
DispatchQueue.main.asyncAfter(deadline: .now() + 0.5, execute: item)
// if the user kept typing — cancel and schedule again (debounce)
item.cancel()
```

## Step 9. DispatchGroup — waiting for a set of tasks

`DispatchGroup` combines several tasks (even on **different** queues) into a group and lets you find out when **all** of them have finished.

**Way 1 — `async(group:)`**, when the task is synchronous by itself:

```swift
let group = DispatchGroup()
let globalDefault = DispatchQueue.global()

for i in 0..<5 {
    globalDefault.async(group: group) {
        sleep(UInt32(i))
        print("Group async on globalDefault: \(i)")
    }
}

group.notify(queue: .main) {
    print("All tasks are finished")      // does not block
}
```

**Way 2 — `enter()` / `leave()`**, when the task has asynchrony of its own inside (networking, callbacks). `async(group:)` can't track the end of a callback, so we use the counter by hand:

```swift
let group = DispatchGroup()

group.enter()
service.loadPhotos { _ in
    group.leave()
}

group.enter()
service.loadMessages { _ in
    group.leave()
}

group.notify(queue: .main) {
    print("All data loaded")
}
```

An interview example, "What is DispatchGroup for?":

```swift
let group = DispatchGroup()

func downloadImages() {
    for i in 0..<5 {
        group.enter()
        print("Image download start - \(i)")
        DispatchQueue.global().async {
            sleep(1)
            print("Image downloaded - \(i)")
            group.leave()
        }
    }
    group.notify(queue: DispatchQueue.global()) {
        print("All images are downloaded.")
    }
}
// Image download start - 0 … 4   (immediately, in order)
// Image downloaded - …           (after ~1 s, in arbitrary order)
// All images are downloaded.     (last)
```

![A sequence diagram: Code, DispatchGroup, Background tasks. The code calls enter() five times, the counter is 5; starts 5 downloads; subscribes via notify(queue:). The background tasks call leave() five times, the counter goes down 4, 3, 2, 1, 0. Then DispatchGroup calls the notify block in the code.](../../../../assets/tutorials/en/concurrency/02-dispatch-group.svg)

**notify vs wait:**

- `group.notify(queue:)` — **doesn't block**, runs the block on the given queue when the counter reaches 0.
- `group.wait()` — **blocks the current thread** until the tasks finish. Can take a timeout: `group.wait(timeout: .now() + 5)`.

> There must be **exactly as many** `leave()` calls as `enter()` calls. An extra `leave()` → crash. A missing one → `notify` is never called. Never call `group.wait()` on the main thread.

## Step 10. Other GCD tools

| Tool | What it does | Details |
| --- | --- | --- |
| `DispatchSemaphore` | Limits the number of threads accessing a resource at the same time | [tutorial 04](../thread-safety-synchronization/) |
| Dispatch Barrier (`flags: .barrier`) | While the task runs, turns a concurrent queue into a serial one | [tutorial 04](../thread-safety-synchronization/) |
| `concurrentPerform(iterations:execute:)` | A parallel loop: spreads the iterations over the cores and waits for them to finish | below |
| `DispatchSource` | Listens for system events: timers, the file system, signals | below |

A parallel loop:

```swift
let images: [UIImage] = loadAll()
var thumbnails = [UIImage?](repeating: nil, count: images.count)
let lock = NSLock()

DispatchQueue.concurrentPerform(iterations: images.count) { index in
    let thumb = makeThumbnail(images[index])   // the heavy work — in parallel
    lock.lock(); thumbnails[index] = thumb; lock.unlock()
}
// we get here once all iterations are done (the call is synchronous)
```

A timer on DispatchSource (it doesn't depend on RunLoop, unlike Timer — see [tutorial 07](../runloop/)):

```swift
let timer = DispatchSource.makeTimerSource(queue: .global(qos: .utility))
timer.schedule(deadline: .now(), repeating: .seconds(1))
timer.setEventHandler { print("tick") }
timer.resume()
// timer.cancel() — stop it
```

## Step 11. Rules for working with GCD safely

Queues themselves are thread-safe, but it is important to remember:

1. **Avoid `sync`** on queues — it is the main source of deadlocks. Never call `DispatchQueue.main.sync` from the main thread.
2. **Avoid taking locks** inside a DispatchWorkItem — blocking tasks make GCD create new threads (thread explosion).
3. **Race conditions are still with us** — GCD doesn't protect your data automatically.

## Step 12. GCD or OperationQueue?

| Capability | GCD | OperationQueue |
| --- | --- | --- |
| Wait for all tasks to finish | yes — DispatchGroup | yes — `waitUntilAllOperationsAreFinished`, but don't block the main queue! |
| Dependencies between tasks | Only chains on one serial queue or nested callbacks | yes — `addDependency` |
| Barrier | yes — `.barrier` | Possible (`addBarrierBlock`), but more convoluted |
| Cancel all tasks | Only one DispatchWorkItem at a time | yes — `cancelAllOperations()` |
| Limit the number of simultaneous tasks | Via a semaphore | yes — `maxConcurrentOperationCount` |

## Common mistakes

- `DispatchQueue.main.sync { }` from the main thread → **deadlock** (in detail in [tutorial 03](../concurrency-problems/)).
- `serialQueue.sync { }` from inside a task of that same `serialQueue` → deadlock.
- Updating the UI inside `DispatchQueue.global().async` without hopping to main.
- Unbalanced `enter()` / `leave()` in a group.
- `group.wait()` or `semaphore.wait()` on the main thread → freeze.
- Expecting tasks on a concurrent queue to **finish** in the order they were added.
- Hundreds of blocking tasks on a global queue → thread explosion.

<details>
<summary>Do you need to write [weak self] in GCD closures?</summary>

There will be no retain cycle: the queue holds the closure only until it runs, and `self` doesn't store the queue-closure pair. So `[weak self]` isn't required to avoid a leak. But it is useful when you don't need to extend the object's lifetime: for example, the screen was closed and the result of the background task is no longer needed.

</details>

## Cheat sheet

```swift
// Queues
DispatchQueue.main                                    // serial, UI
DispatchQueue.global(qos: .utility)                   // concurrent, system-provided
DispatchQueue(label: "com.app.serial")                // your own serial
DispatchQueue(label: "com.app.conc", attributes: .concurrent)

// Dispatching
queue.async { }                  // don't wait
queue.sync { }                   // wait (careful!)
queue.asyncAfter(deadline: .now() + 1) { }

// Background → UI
DispatchQueue.global().async { let r = work(); DispatchQueue.main.async { show(r) } }

// WorkItem
let item = DispatchWorkItem(qos: .userInitiated, flags: []) { }
item.notify(queue: .main) { }; item.cancel()

// Group
group.enter(); ...; group.leave()
group.notify(queue: .main) { }   // doesn't block
group.wait()                      // blocks

// QoS ↓ in descending order
// userInteractive > userInitiated > default > utility > background (> unspecified)
```

## Self-check questions

<details>
<summary>1. How does a serial queue differ from a concurrent one?</summary>

A serial queue runs one task at a time, strictly in order. A concurrent queue starts tasks in order, but can run several at once on different threads, and they finish in arbitrary order.

</details>

<details>
<summary>2. How does sync differ from async?</summary>

`sync` blocks the current thread until the task finishes. `async` puts the task on the queue and returns control immediately.

</details>

<details>
<summary>3. What happens when you call DispatchQueue.main.sync {} in viewDidLoad?</summary>

Deadlock. The main thread blocks waiting for the task, and the task waits for the main serial queue to become free — that is, for the current task on the main thread to finish. The circle is closed.

</details>

<details>
<summary>4. What QoS levels exist, and which one should you choose for downloading a file with a progress bar?</summary>

userInteractive, userInitiated, default, utility, background, unspecified. For a download with progress — `.utility`.

</details>

<details>
<summary>5. What can DispatchWorkItem do that a plain closure can't?</summary>

Set QoS and flags, notify a queue on completion via `notify`, cancel the task before it starts running via `cancel`, wait for it to finish via `wait`.

</details>

<details>
<summary>6. When to use enter/leave, and when async(group:)?</summary>

`async(group:)` — when the task is synchronous inside the closure. `enter`/`leave` — when there is asynchrony of its own inside (a network callback): otherwise the group will consider the task finished too early.

</details>

<details>
<summary>7. How does group.notify differ from group.wait?</summary>

`notify` asynchronously calls the block on the given queue and doesn't block the thread; `wait` blocks the current thread until all tasks finish.

</details>

## Sources

- [Grand Central Dispatch, Once and for All — HackerNoon](https://hackernoon.com/grand-central-dispatch-once-and-for-all)
- [Do you need to write weak self in Grand Central Dispatch?](https://temofeev.ru/info/articles/nuzhno-li-pisat-weak-self-v-grand-central-dispatch/) (in Russian)
- [Multithreading basics in iOS — Mad Brains Techno](https://youtu.be/JgUBBoRydoE?list=PLw6SJ6q6-1YowmlGVks5a088XrSbihJu-&t=1496) (video, in Russian)
