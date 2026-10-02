---
title: "Rx: what is the difference between .zip and .merge?"
category: concurrency
order: 80
---

`zip` combines the elements of several Observables with a given function and emits one element per combination: the n-th element of the result is built from the n-th elements of the sources, and the number of elements is limited by the shortest source.

`merge` combines the emissions of several Observables into one stream as they are and can interleave elements from different sources; the elements are not combined with each other.
