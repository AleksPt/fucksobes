---
title: "On which thread is deinit called in ARC? The same one where the object was created, or a different one?"
category: memory
order: 37
---

Most likely on the same thread: an object is deallocated at the end of the run loop, and a run loop is tied to a specific thread.
