---
title: "What is logging used for? What logging levels are there?"
category: tooling
order: 20
---

Logging records the progress of a program: it helps you understand what happened before an error, especially where a debugger isn't available (on users' devices, in CI, in the background). Logs are used for diagnostics, analytics and support.

On Apple platforms this is `os.Logger` (unified logging) with these levels:

- `debug`: verbose messages for development, not persisted in release builds;
- `info`: auxiliary information, stored only in memory;
- `notice` (the default level): important events, persisted to disk;
- `error`: an error after which the app keeps working;
- `fault`: a critical error or programmer error after which work is impossible.

```swift
let logger = Logger(subsystem: "com.app", category: "network")
logger.error("Failed to load: \(error.localizedDescription)")
```

Dynamic data in `os.Logger` is hidden as private by default (`privacy: .public` turns the hiding off). Logs are viewed in the Xcode console and the Console app. Unlike `print`, `os.Logger` is faster and is controlled through levels and categories.
