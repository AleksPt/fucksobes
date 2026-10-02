---
title: "What do the tables in table dispatch store?"
category: swift
order: 77
---

The table stores references to memory where **classes** or **their implementations** are located.

- Classes that support inheritance use a virtual function table to store method addresses.
- If a method is overridden in a subclass, the virtual function table will contain a reference to that overridden method.
