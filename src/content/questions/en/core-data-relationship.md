---
title: "What is a Relationship in Core Data?"
category: data-storage
order: 31
---

A **relationship** is a property of an entity that, unlike an attribute, stores not a value but a **reference to another Core Data record** (or to a record of the same entity). It is the equivalent of a foreign key in a relational database.

For a relationship you specify:

- **cardinality**: to-one (a single related record) or to-many (a set of records, represented by `NSSet`/`Set` or, for ordered relationships, `NSOrderedSet`);
- **inverse relationship** — the relationship in the opposite direction on the other entity; Core Data strongly recommends always setting it so that the object graph stays consistent when changes are made from either side;
- **Delete Rule** — what happens to the related objects when the current one is deleted: `Nullify` (clear the reference), `Cascade` (delete the related objects too), `Deny` (forbid deletion while relationships exist), `No Action` (do nothing, which risks leaving "dangling" references).

Example: entities `User` and `Post`, where the user has a to-many relationship `posts` and the post has a to-one relationship `author` whose inverse is `posts`.

```swift
// Accessing a relationship in code looks like accessing a regular property
let post = Post(context: context)
post.author = user       // to-one
user.posts.insert(post)  // to-many; if an inverse is set, Core Data
                          // keeps post.author in sync when inserting into user.posts
```

Adding the new entity that a relationship refers to is usually the first step before the relationship itself can be created in the data model editor: without a second entity there is nothing to relate to.
