---
title: "What quality-of-service classes (QoS) exist in GCD?"
category: concurrency
order: 22
---

**QoS** (Quality of Service) appeared in iOS 8. It helps set the priority with which a `DispatchQueue` task runs. It is used with `.async()`.

- `User Interactive`: interaction with the user. Any work on the main thread, for example animation or updating the interface.
- `User Initiated`: work initiated by the user, for example loading data from an API. It must complete so that the user can keep using the app.
- `Default`: the most commonly used in code.
- `Utility`: tasks that the user does not track and that do not need to complete immediately, for example a progress bar.
- `Background`: background work that the user does not track, for example saving data to a database or any other low-priority work.
- `Unspecified`: no priority; the system chooses it on its own depending on the environment (the current load).
