---
title: "How do you implement reading and writing a file in iOS?"
category: data-storage
order: 24
---

An app works with files in its sandbox through `FileManager`: the path to the needed directory (`Documents`, `Application Support`, `Caches`) is obtained with the `url(for:in:appropriateFor:create:)` or `urls(for:in:)` method.

```swift
let dir = try FileManager.default.url(
    for: .documentDirectory, in: .userDomainMask,
    appropriateFor: nil, create: true
)
let fileURL = dir.appendingPathComponent("note.txt")

try "Hello".write(to: fileURL, atomically: true, encoding: .utf8)
let text = try String(contentsOf: fileURL, encoding: .utf8)
```

For binary data use `Data.write(to:options:)` and `Data(contentsOf:)`, and encode structures through `Codable` first (JSON, plist). The `atomically`/`.atomic` flag writes to a temporary file and then replaces the original, so the old data is not corrupted if a failure occurs. Large files are read in chunks through `FileHandle`, and I/O operations should not be performed on the main thread.
