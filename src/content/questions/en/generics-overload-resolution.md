---
title: "Generics: how does the compiler know which of the overloaded methods to use?"
category: swift
order: 68
---

The overload is chosen at compile time based on the statically known argument types and constraints, not on the runtime type of the value. Among the suitable candidates, the more specialized one wins: for example, an overload for a concrete `Int` is preferred over `func f<T>(_:)`, and `func h<T: P>(_:)` is preferred over `func h<T>(_:)`.

Inside another generic context, all that is known about `T` is what is declared in its constraints, so the overload that fits those constraints is chosen:

```swift
func f<T>(_ x: T) { print("generic") }
func f(_ x: Int) { print("Int") }
func g<T>(_ x: T) { f(x) }

f(1) // Int
g(1) // generic — inside g the compiler does not know the type T
```
