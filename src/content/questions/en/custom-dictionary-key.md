---
title: "What is needed to use a custom struct as a dictionary key?"
category: algorithms
order: 18
---

You can, but only if the struct conforms to the `Hashable` protocol. It includes the `Equatable` requirements: equal values must produce the same hash.
