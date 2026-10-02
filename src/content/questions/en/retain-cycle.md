---
title: "What is a retain cycle and why is it bad?"
category: memory
order: 39
---

A retain cycle (a strong reference cycle) is a common memory management problem: entity A owns entity B, and B owns entity A, so neither can be freed. To fix it, make one of the references `weak` or `unowned`.
