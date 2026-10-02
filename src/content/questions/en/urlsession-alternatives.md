---
title: "What alternatives to URLSession are there? Name their pros and cons"
category: networking
order: 10
---

- **Alamofire** — the most popular third-party wrapper over `URLSession`. Pros: convenient syntax, response validation, request retries, interceptors, file uploads, certificate checking. Cons: an external dependency, overkill for a few simple requests.
- **Moya** — an abstraction layer over a networking library (usually Alamofire) that describes requests with typed enums. Pros: a uniform description of the API, easy to swap out in tests. Cons: an extra abstraction and dependency.
- **Network.framework** — Apple's low-level framework for TCP, UDP and TLS (`NWConnection`). Pros: full control over the connection, works with sockets. Cons: it does not deal in HTTP requests, so you have to write everything by hand.
- **AFNetworking** — the Objective-C predecessor of Alamofire. Cons: outdated and not used in new projects.

If an app just needs to fetch a few JSON responses and show them on screen, `URLSession` is enough: it ships with the SDK, supports `async/await` and adds no dependencies.
