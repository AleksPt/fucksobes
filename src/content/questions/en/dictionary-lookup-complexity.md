---
title: "What is the complexity of looking up a value by key in a dictionary?"
category: algorithms
order: 12
---

Looking up a value by key in a `Dictionary` is amortized O(1). This is stated in the standard library implementation's comment on `index(forKey:)`: "amortized O(1) for native dictionary". For a dictionary that wraps a bridged `NSDictionary`, the same comment gives the complexity as O(*n*).
