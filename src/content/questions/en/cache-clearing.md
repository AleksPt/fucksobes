---
title: "How is the cache cleared? Is it something we have to do as developers, or does the system manage it?"
category: data-storage
order: 12
---

**Automatic cleanup.** The system may delete data from the `Library/Caches` folder on its own:

- when the device is low on free space;
- when the app is updated or deleted.

**Cleanup by the developer.** Sometimes the app has to manage cache cleanup itself. This is necessary if:

- the data is no longer relevant (for example, a stale image or network data cache);
- you need to free up space for new data.
