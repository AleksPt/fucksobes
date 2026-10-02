---
title: "Which is faster: checking for an element in an Array or in a Set? What is the complexity? What makes Set faster?"
category: algorithms
order: 3
---

Set is faster because it is backed by a hash table: checking whether an element is present takes **O(1)** on average. In an Array you have to scan the elements — **O(n)**.
