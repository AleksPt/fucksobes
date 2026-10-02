---
title: "Suppose there is a class with a private variable, and then in the same file we create an extension and try to access the private variable. Will that work?"
category: swift
order: 35
---

Yes: **within one file**, a class's `private` variable can be accessed from its **extension**. In Swift, `private` restricts access to the declaration and its extensions located in the same file.
