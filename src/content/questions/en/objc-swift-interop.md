---
title: "Can you combine Objective-C and Swift code in one project? If so, how?"
category: swift
order: 101
---

Yes, both languages can coexist in a single target.

- **Calling Objective-C from Swift:** create a bridging header (`<Project>-Bridging-Header.h`) where you import the needed headers with `#import "MyClass.h"`, and specify it in the `Objective-C Bridging Header` build setting. All the types declared there are then visible in Swift. In a framework, an umbrella header is used instead.
- **Calling Swift from Objective-C:** import the automatically generated header `#import "<ProductModuleName>-Swift.h"` (in a framework, `<Framework/Framework-Swift.h>`). It exposes types marked `@objc` or inheriting from `NSObject`.

For Swift code to be visible from Objective-C, mark it with `@objc` (or `@objcMembers` on a class to expose all compatible members). `dynamic` is not needed for visibility: it makes a member be called through the Objective-C runtime (needed for KVO and swizzling) and requires `@objc`. Not all Swift features are available: generics, structs, enums with associated values, protocols with `associatedtype`, tuples, and nested types are not accessible from Objective-C. For better integration, Objective-C code is annotated with `nullability` (`nonnull`, `nullable`) and `NS_SWIFT_NAME`.
