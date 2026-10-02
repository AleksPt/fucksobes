---
title: "Give an example of the open/closed principle in UIKit"
category: architecture
order: 10
---

In UIKit we have no access to the implementation. For example, you can add new functionality to `UIView` by making it conform to a custom protocol (interface) and implementing that protocol. The base implementation of the class is unchanged, and the new functionality is added, so the principle is not violated.

A second example: we create our own class, subclass `UIView`, for instance, and add new functionality.
