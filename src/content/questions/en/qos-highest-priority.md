---
title: "What is the highest priority in QoS?"
category: concurrency
order: 23
---

The highest is **User-interactive**. All the levels in descending order of priority:

- **User-interactive**: the maximum priority, for tasks that must complete before the UI updates (for example, animations).
- **User-initiated**: high priority for tasks initiated by the user that must complete quickly (for example, user requests).
- **Utility**: medium priority for tasks that may take some time but do not block the interface (for example, loading data).
- **Background**: low priority for background tasks that do not affect the user experience (for example, data synchronization).
