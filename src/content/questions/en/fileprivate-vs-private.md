---
title: "What is the difference between the fileprivate and private access levels?"
category: swift
order: 34
---

**`fileprivate`** — access to data members and functions within the current file. It is used to hide implementation that is needed only in that source file.

**`private`** — the lowest access level. It allows an entity to be used only within its declaration or an extension of it in the current file. There is no access from subclasses or other files.
