---
title: "What dispatch is used for extensions in Swift?"
category: swift
order: 82
---

**Static.** Methods and properties added through an `extension` are called with static dispatch, because they do not support overriding.
