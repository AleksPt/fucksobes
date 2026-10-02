---
title: "OOP principles and how they are implemented in iOS"
category: architecture
order: 2
---

**Encapsulation**

A property of a system that lets you combine data and methods in a class and hide the implementation details from the user. The less data and fewer methods are available from outside, the more reliable the code: there are fewer ways to affect an entity from outside, less unexpected behavior, and the code is easier to maintain.

**Inheritance**

A class inherits the properties and methods of another class, forming a hierarchy of parent and child classes. This lets you write tidy code with minimal duplication. For example, we constantly subclass `UIViewController`: it has a lot of useful built-in functionality, and we add only the details we need.

**Polymorphism**

The ability of methods, functions, or objects to behave differently depending on the context of use. Kinds of polymorphism: function overloading; and the base class interface, where objects behave differently depending on their actual type.

*Generics as a form of polymorphism.* Generics let you write universal, reusable code that works with any types while preserving strict typing and safety.

**Abstraction**

Picking out the key characteristics of objects and their behavior while ignoring unimportant details. Only the main functionality needed for the task is put into the abstraction, for example through a protocol: it defines a common interface for objects and hides the details of their implementation.
