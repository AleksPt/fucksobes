---
title: "What is function overloading?"
category: swift
order: 144
---

Overloading means having several functions with the same name that differ in their signature: the number of parameters, their types, the external argument labels, or the return type.

```swift
func show(_ x: Int) { print("Int \(x)") }
func show(_ x: String) { print("String \(x)") }
func show(_ x: Int, times: Int) { }     // a different number of parameters
func value() -> Int { 1 }
func value() -> String { "1" }          // overloading by return type: the type is inferred from context
let s: String = value()
```

The compiler chooses the right overload at compile time based on the argument types and the context; from the suitable candidates, the most specific one is chosen (a concrete type is preferred over a generic one, and an overload without conversions over one with conversions). If it cannot choose unambiguously, you get an "ambiguous use" error.

Overloads cannot differ only by the (internal) parameter name or only by `inout`. Overloading interacts poorly with dynamic dispatch: the overload is chosen statically, so a call through a base type picks the version for that type, not for the object's actual class. Excessive overloading of operators and functions slows down compilation and hurts readability.
