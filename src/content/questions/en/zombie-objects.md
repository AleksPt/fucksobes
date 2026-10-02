---
title: "What are zombie objects?"
category: memory
order: 49
---

Zombie objects are a problem that existed before the side table appeared: objects that stay in memory until removal but that nobody accesses. The side table helped solve this problem: if an object has weak references but no strong references, the object itself is removed from memory, and only its side table remains.
