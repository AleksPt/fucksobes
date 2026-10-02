---
title: "How does thread safety of arrays work?"
category: concurrency
order: 59
---

Structs in Swift are not thread-safe, but when they are passed between threads, data integrity is preserved as long as no writes occur.
