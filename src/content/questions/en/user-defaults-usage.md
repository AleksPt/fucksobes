---
title: "What can UserDefaults be used for?"
category: data-storage
order: 2
---

For storing non-secret app settings and configuration: units of measurement, user preferences, behavior flags. Values are simple types (`Int`, `Bool`, `String`, `URL`, `Date`, `Array`, `Dictionary`); other objects must be archived into `Data` beforehand, but it is better to choose simple types. Default values are registered through `register(defaults:)`, and in SwiftUI `@AppStorage` works with `UserDefaults`.
