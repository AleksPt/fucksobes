---
title: "What is conditional compilation? What is it used for?"
category: swift
order: 104
---

Conditional compilation includes or excludes sections of code at build time, so the excluded code does not end up in the binary. In Swift this is done with the `#if … #elseif … #else … #endif` directive and compilation conditions.

```swift
#if DEBUG
print("debug output")
#endif

#if os(iOS)
import UIKit
#elseif os(macOS)
import AppKit
#endif

#if targetEnvironment(simulator)
// simulator-only code
#endif
```

Available conditions: custom flags (`-D FLAG` in `Active Compilation Conditions`), `DEBUG`, the platform (`os(...)`), the architecture (`arch(...)`), the language and compiler version (`swift(>=5.9)`, `compiler(>=5.9)`), the ability to import a module (`canImport(...)`), and the simulator (`targetEnvironment(simulator)`).

It is used for debug code, for supporting several platforms in a shared codebase, for different build configurations (staging and production), and for different Swift versions. Code inside an excluded branch must still be syntactically valid. Don't overuse it: such code is harder to test and read.
