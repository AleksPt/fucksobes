---
title: "What is method swizzling, and what type of dispatch does it belong to?"
category: swift
order: 86
---

Method swizzling is the replacement of the implementations of two methods at runtime using the Objective-C runtime; for example, `method_exchangeImplementations(_:_:)` swaps the implementations of two methods.

It belongs to dynamic dispatch (message dispatch through the Objective-C runtime). In Swift, such access is guaranteed by the `dynamic` modifier: a member marked with it is always called through the Objective-C runtime and is never inlined or devirtualized by the compiler. For this, the member must be marked with the `objc` attribute.
