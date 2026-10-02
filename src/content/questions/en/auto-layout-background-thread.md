---
title: "Can we add Auto Layout constraints off the main thread?"
category: uikit
order: 44
---

**No.** You must not add or modify Auto Layout constraints (`NSLayoutConstraint`) off the main thread: it is not safe to work with Auto Layout on a background thread. All UI operations, including Auto Layout, must be performed on the **main thread**, because UIKit is not thread-safe; otherwise incorrect behavior or crashes are possible.
