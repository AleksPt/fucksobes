---
title: "What is the difference between a delegate and KVO in terms of the types of relationships?"
category: architecture
order: 19
---

A **delegate** is a "one object and its helper" relationship: the delegating object holds a reference to the delegate and sends it messages about events at the right moments. The delegate can react to an event or return a value that affects how the event will be handled (for example, `NSWindow` asks its delegate `windowShouldClose:`).

**KVO** is a mechanism in which objects receive notifications when specified properties of other objects change. The observed object notifies each observer directly; there is no central broadcasting object like the one in `NSNotificationCenter`. This is why several objects can observe the same property at once.

Summary by type of relationship: a delegate is a directed relationship with a single receiving object, which can also influence behavior; KVO is a "one observed, many observers" relationship, where the observers only learn that a property has changed.
