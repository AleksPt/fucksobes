---
title: "Можно ли сослаться weak-ссылкой на enum, struct, array или dictionary?"
category: memory
order: 66
---

**В Swift — нельзя.** Модификатор `weak` (как и `unowned`) применим только к экземплярам классов, то есть к ссылочным типам (и протоколам, ограниченным `AnyObject`). Структуры, перечисления, массивы и словари — value-типы: они копируются, и слабо ссылаться на копию нет смысла. Компилятор выдаёт ошибку: `'weak' may only be applied to class and class-bound protocol types`.

Если нужна слабая ссылка на что-то внутри value-типа, значение оборачивают в класс или сами слабые ссылки помещают в оболочку:

```swift
final class Box<T> { var value: T; init(_ value: T) { self.value = value } }

struct Weak<T: AnyObject> { weak var object: T? }
var list: [Weak<MyClass>] = []      // массив слабых ссылок
```

**В Objective-C** — можно для `NSArray` и `NSDictionary` (и `NSMutable...`), потому что это объекты; слабо сослаться можно и на любой объект (`NSObject`). Примитивы (`int`, `struct`) слабыми быть не могут. Для коллекции, которая слабо хранит элементы, есть `NSPointerArray` и `NSMapTable` с опцией `weakObjects`.
