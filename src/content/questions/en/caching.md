---
title: "How can we cache data?"
category: networking
order: 4
---

Caching can be done at several levels:

- **In memory — `NSCache`**: a dictionary-like container that evicts items on its own under memory pressure, is thread-safe, and does not copy keys. It suits decoded images and computed results. Limits are set with `countLimit` and `totalCostLimit`.
- **HTTP cache — `URLCache`**: `URLSession` caches responses based on the `Cache-Control`, `ETag` and `Expires` headers; the policy is set via `URLRequest.cachePolicy` and `URLSessionConfiguration.urlCache`. This is the simplest option for network data.
- **On disk**: files in the `Caches` directory (the system may purge it when storage runs low), `UserDefaults` for small values only, and Core Data, SwiftData or SQLite for structured data that must persist.
- **Ready-made libraries** for images: Kingfisher, SDWebImage (memory and disk cache).

It is important to design cache keys and invalidation rules (by time, version or event) so you do not show stale data.
