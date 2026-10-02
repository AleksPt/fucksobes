---
title: "If you write implementations of the protocols' methods in an extension in both cases, how will the compiler behave?"
category: swift
order: 57
---

On a direct call to the method, the compiler will report an error because of ambiguity. To avoid it, you must either implement the method explicitly in the class or always qualify the protocol at the call site.
