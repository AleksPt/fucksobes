---
title: "Как отловить вызовы всех классов в закрытой либе?"
category: swift
order: 88
---

Через swizzling: найти классы библиотеки и подменить их методы обёртками, которые записывают вызов и передают управление оригинальной реализации.

1. **Классы библиотеки.** `class_getImageName(_:)` возвращает имя динамической библиотеки, из которой пришёл класс, а `objc_copyClassNamesForImage(_:_:)` — имена всех классов этой библиотеки или фреймворка. Список вообще всех зарегистрированных классов даёт `objc_copyClassList(_:)`, но для чужой библиотеки удобнее ограничиться её образом.
2. **Методы класса.** `class_copyMethodList(_:_:)` возвращает instance-методы самого класса (унаследованные от суперклассов в список не входят); методы класса берут у метакласса: `object_getClass(cls)`. Возвращённый массив нужно освободить через `free()`.
3. **Подмена.** `method_setImplementation(_:_:)` заменяет реализацию, а `method_exchangeImplementations(_:_:)` атомарно меняет две реализации местами. В обёртке пишут лог и вызывают исходную реализацию.

```swift
guard let image = class_getImageName(DateFormatter.self) else { return }

var nameCount: UInt32 = 0
if let names = objc_copyClassNamesForImage(image, &nameCount) {
    defer { free(names) }
    for i in 0..<Int(nameCount) {
        guard let cls = NSClassFromString(String(cString: names[i])) else { continue }
        var methodCount: UInt32 = 0
        if let methods = class_copyMethodList(cls, &methodCount) {
            defer { free(methods) }
            // для каждого methods[j] здесь можно подставить обёртку через method_setImplementation
        }
    }
}
```

Ограничение: так перехватываются только вызовы, идущие через Objective-C runtime (message dispatch). Для членов Swift доступ через runtime гарантирует модификатор `dynamic` вместе с `@objc`.
