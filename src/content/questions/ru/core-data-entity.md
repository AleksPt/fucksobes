---
title: "Что такое Entity в Core Data?"
category: data-storage
order: 29
---

**Entity** (сущность) — описание типа данных в модели Core Data, аналог таблицы в реляционной базе или класса в объектной модели. Описывается на этапе проектирования — в редакторе `.xcdatamodeld` или программно — и представлена в рантайме классом `NSEntityDescription`.

Сущность задаёт «форму» будущих объектов:

- имя (`name`), под которым сущность известна Core Data (например, для `NSFetchRequest(entityName:)`);
- имя класса, который представляет объекты этой сущности (`NSManagedObject` или его подкласс);
- набор **атрибутов** (`attributes`) — простых значений;
- набор **связей** (`relationships`) — ссылок на другие сущности;
- родительскую сущность, если используется наследование сущностей.

Сама сущность не хранит данные — это только описание схемы. Конкретные значения хранят экземпляры `NSManagedObject`, созданные по этой сущности и привязанные к `NSManagedObjectContext`:

```swift
let entity = NSEntityDescription.entity(forEntityName: "User", in: context)!
let user = NSManagedObject(entity: entity, insertInto: context)
user.setValue("Alex", forKey: "name")
```

При работе с генерируемыми подклассами (`NSManagedObject` subclass) это выглядит проще — как с обычным Swift-классом, но за кулисами всё так же опирается на `NSEntityDescription` из модели.
