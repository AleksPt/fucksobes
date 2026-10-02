---
title: "Do you need to call super in loadView? Why?"
category: uikit
order: 30
---

No, it would cause recursion, because `loadView` is a lazy method.
