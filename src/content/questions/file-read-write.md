---
title: "Как реализовать чтение и запись файла в iOS?"
category: data-storage
order: 24
---

Приложение работает с файлами в своей песочнице через `FileManager`: путь к нужному каталогу (`Documents`, `Application Support`, `Caches`) получают методом `url(for:in:appropriateFor:create:)` или `urls(for:in:)`.

```swift
let dir = try FileManager.default.url(
    for: .documentDirectory, in: .userDomainMask,
    appropriateFor: nil, create: true
)
let fileURL = dir.appendingPathComponent("note.txt")

try "Привет".write(to: fileURL, atomically: true, encoding: .utf8)
let text = try String(contentsOf: fileURL, encoding: .utf8)
```

Для бинарных данных используют `Data.write(to:options:)` и `Data(contentsOf:)`, а структуры сначала кодируют через `Codable` (JSON, plist). Флаг `atomically`/`.atomic` записывает во временный файл и затем заменяет оригинал, поэтому при сбое старые данные не портятся. Большие файлы читают частями через `FileHandle`, а операции ввода-вывода не выполняют на главном потоке.
