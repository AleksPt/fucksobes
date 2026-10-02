---
title: "When there is inheritance, say we have some subclasses, and we call a method, what exactly gets looked up?"
category: swift
order: 76
---

A **lookup of the specific implementation of the method** to call takes place. This process is called **dynamic dispatch** (if the method is virtual) and is driven by the virtual function table (v-table).
