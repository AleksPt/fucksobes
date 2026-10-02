---
title: "How do you access a specific element of a string?"
category: swift
order: 12
---

By a `String.Index`, not by an integer: a string is a collection of `Character`s (extended grapheme clusters), and a single character can consist of several Unicode scalars, so indices have to be computed, for example `str[str.index(str.startIndex, offsetBy: 1)]`.

Unicode scalars are available through the separate `unicodeScalars` view.
