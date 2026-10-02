---
title: "Why isn't try/catch used in Objective-C the same way as in Swift?"
category: swift
order: 141
---

Objective-C has `@try/@catch` and exceptions (`NSException`), but they are not used for ordinary error handling; they are reserved for programmer errors (out-of-bounds array access, an invalid argument). Expected errors are returned as `NSError` through an `NSError **` pointer parameter and the return value (`BOOL` or `nil`).

Reasons:

- **Memory leaks.** When an exception is thrown, the stack is "unwound", and the code after the throw point does not run, including `release` calls and resource cleanup. That is why ARC by default does not generate cleanup code for exception paths (the `-fobjc-arc-exceptions` flag is needed), and objects leak.
- **Cocoa is not designed for recovery** after exceptions: the state of objects may be left inconsistent.
- Apple's conventions: exceptions are for programmer errors, `NSError` is for runtime errors.

In Swift, errors work differently: `throw` is an ordinary return of control (the error is passed as the function's result), not stack unwinding, so the `defer` chain and deinitialization run correctly. Swift does not catch Objective-C exceptions: the app crashes, so such code is wrapped on the Objective-C side.
