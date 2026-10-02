---
title: "What does ARC do at runtime and what does it do at compile time?"
category: memory
order: 16
---

**At compile time**, ARC inserts `retain`, `release`, and `autorelease` instructions into the code to manage object lifetimes.

**At runtime**, these instructions are executed and change the object's reference count. When the count reaches zero, the object is deallocated.
