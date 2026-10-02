---
title: "What is delayed deallocation?"
category: memory
order: 70
---

An object may be deallocated not at the moment when it "seems" it should be. There are several reasons.

- **Shortened lifetime.** Swift does not guarantee that an object lives until the end of its scope: ARC may release it right after its last use, so `deinit` can fire before the end of the block. To extend the lifetime to a specific point, use `withExtendedLifetime(_:_:)`.
- **Unowned references.** When the strong reference count reaches zero, `deinit` is called and the object is considered destroyed, but the memory for it is freed later, only when all `unowned` references are gone (and the weak ones in the side table are zeroed).
- **Autorelease.** In Objective-C and when working with its APIs, an object may be placed in an autorelease pool and released only when the pool is drained (for example, at the end of a loop iteration or a run loop pass). That is why loops that create many temporary objects use `autoreleasepool { }`.
- **Deferred releases on other threads or queues** (for example, `deinit` runs on the thread where the last reference was dropped).

Because of this, you cannot rely on when `deinit` is called for critical logic.
