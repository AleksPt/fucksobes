---
title: "On which thread is deinit called in ARC? The same one where the object was created, or a different one?"
category: memory
order: 37
---

Not necessarily the same one: `deinit` is called synchronously on the thread where the last strong reference was dropped. If an object was created on the main thread but the last reference disappeared on a background queue, `deinit` runs there. It is not tied to the run loop.
