---
title: "What is final, and why does using it make dispatch static?"
category: swift
order: 84
---

A `final` declaration cannot be inherited from, so its methods cannot be overridden. This means we know in advance that the methods will not be overridden and their addresses can be determined right at compile time, which is why static dispatch is used.
