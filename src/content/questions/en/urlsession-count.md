---
title: "How many sessions (URLSession) can an app have? Which requests can be grouped into one session, and which can't?"
category: networking
order: 17
---

There is no limit on the number of sessions, but you should not create one per request. A session is a **configuration and shared context**: timeouts, cache, cookies, default headers, proxies, the connection pool and a delegate. So requests with the same settings are grouped into one session, and requests with different settings are kept apart.

You can combine requests into one session when they have:

- the same configuration (timeouts, cache, cookies, headers);
- a shared delegate (authentication, metrics);
- the same service as the target: connections are reused (HTTP/2, keep-alive), which is faster.

A separate session is needed when you require:

- **background transfers**: `URLSessionConfiguration.background(withIdentifier:)`, where the identifier is unique within the app;
- **`ephemeral`** mode with no cache or cookies on disk (for example, for private data);
- different **timeouts**, cache policy or network access (`allowsCellularAccess`);
- a different **delegate**: for example, SSL pinning for a specific host;
- a separate cookie store or credentials.

In practice: one `URLSession.shared` for simple requests, one configured session for the network layer, and separate ones for background and special cases.

Important: a session **strongly retains its delegate**, so a session you create manually must be invalidated with `finishTasksAndInvalidate()` (or `invalidateAndCancel()`), otherwise it leaks.

```swift
let api = URLSession(configuration: .default)                  // main network layer
let privateSession = URLSession(configuration: .ephemeral)     // no cache or cookies
let background = URLSession(
    configuration: .background(withIdentifier: "com.app.upload"),
    delegate: uploadDelegate,
    delegateQueue: nil
)
```
