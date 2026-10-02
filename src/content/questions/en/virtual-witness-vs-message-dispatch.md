---
title: "How do Virtual / Witness differ from Message Dispatch?"
category: swift
order: 78
---

Virtual and Witness dispatch use tables built by the Swift compiler. A vtable is tied to a class and maps each overridable method to an implementation; a witness table represents conformance to a protocol (essentially the same as a vtable, but for a protocol). The compiler can devirtualize such calls, for example if the type or method is `final`.

Message dispatch is a call through the Objective-C runtime (`objc_msgSend`). The compiler never devirtualizes such calls. In Swift, access through the runtime is guaranteed by the `dynamic` modifier: it applies to class members that can be represented in Objective-C (the `objc` attribute is required), and such calls are never inlined or devirtualized.
