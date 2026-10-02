---
title: "What is a Service Locator, and what problems does it have?"
category: architecture
order: 24
---

A Service Locator is a Singleton that, instead of creating separate global objects, lets you request dependencies as needed. It is convenient in small projects, but in large systems it causes problems: hidden dependencies, and difficulties with testing and state management.
