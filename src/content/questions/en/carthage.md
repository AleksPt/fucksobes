---
title: "What is Carthage and how do you use it?"
category: tooling
order: 26
---

Carthage is a decentralized dependency manager for Apple platforms. Unlike CocoaPods, it does not modify the project and does not create a workspace: it builds libraries into ready-made binary frameworks (XCFrameworks), which the developer adds to the project manually.

Usage:

1. Install it: `brew install carthage`.
2. Describe the dependencies in a `Cartfile`:

```
github "Alamofire/Alamofire" ~> 5.8
```

3. Run `carthage update --use-xcframeworks`: Carthage downloads the sources, builds them and puts the result in `Carthage/Build`, and records the exact versions in `Cartfile.resolved`.
4. Drag the built `.xcframework` files into the project target (Frameworks, Libraries) and choose Embed & Sign.

Pros: it does not interfere with the project structure, and there is no central registry. Cons: manual integration, slow dependency builds on updates, and the library must support building with Carthage; its popularity has dropped because of SPM.
