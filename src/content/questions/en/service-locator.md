---
title: "What is a Service Locator, and what problems does it have?"
category: architecture
order: 24
---

A Service Locator is a registry of services from which objects request the dependencies they need. It is often implemented as a Singleton, but it doesn't have to be: a locator can also be an ordinary object. It is convenient in small projects, but in large systems it causes problems: hidden dependencies, and difficulties with testing and state management.
