---
title: "What is an Entity in Core Data?"
category: data-storage
order: 29
---

An **entity** is the description of a data type in a Core Data model, the equivalent of a table in a relational database or a class in an object model. It is defined at design time, in the `.xcdatamodeld` editor or programmatically, and is represented at runtime by the `NSEntityDescription` class.

An entity defines the "shape" of the future objects:

- the name (`name`) under which the entity is known to Core Data (for example, for `NSFetchRequest(entityName:)`);
- the name of the class that represents objects of this entity (`NSManagedObject` or a subclass of it);
- a set of **attributes** (`attributes`) — simple values;
- a set of **relationships** (`relationships`) — references to other entities;
- a parent entity, if entity inheritance is used.

The entity itself does not store data: it is only a schema description. The actual values are stored by `NSManagedObject` instances created from the entity and bound to an `NSManagedObjectContext`:

```swift
let entity = NSEntityDescription.entity(forEntityName: "User", in: context)!
let user = NSManagedObject(entity: entity, insertInto: context)
user.setValue("Alex", forKey: "name")
```

With generated subclasses (`NSManagedObject` subclasses) this looks simpler, like working with a regular Swift class, but behind the scenes it still relies on the `NSEntityDescription` from the model.
