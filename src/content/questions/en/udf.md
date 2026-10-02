---
title: "UDF (Unidirectional data flow)"
category: architecture
order: 28
---

**Unidirectional data flow** is an approach in which data moves in one direction: **State** describes the app's state and serves as the single source of truth, **View** is built declaratively from the current state, and **Actions** are events from the user that update the state. After the state is updated, the UI is redrawn.

This makes the app's behavior predictable and debugging easier.

