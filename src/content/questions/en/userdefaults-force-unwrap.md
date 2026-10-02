---
title: "What is the problem in code that reads a theme color from UserDefaults using force unwrap?"
category: swift
order: 116
---

```swift
var color = UserDefaults.standard.string(forKey: "themeColor")!
print(color)
```

`string(forKey:)` returns `String?`: if the key has never been written (first launch, after data was deleted, a changed key), the result is `nil`, and the forced unwrap `!` will crash the app.

Fixes:

```swift
// a default value
let color = UserDefaults.standard.string(forKey: "themeColor") ?? "blue"

// or explicit handling of a missing value
guard let color = UserDefaults.standard.string(forKey: "themeColor") else { return }
```

Another option is to register default values at launch: `UserDefaults.standard.register(defaults: ["themeColor": "blue"])`; then reading returns them until something else is written. It is better to extract the string key into a constant to avoid typos.
