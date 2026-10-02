---
title: "What is the testing pyramid?"
category: testing
order: 10
---

The testing pyramid is a model showing which kinds of tests a project should have more of and which fewer, and it helps distribute effort between levels. It is usually split into three levels (bottom to top):

- **Unit tests** are the base: there are the most of them. They check individual functions and classes in isolation, run fast, are stable and point precisely at the location of a bug.
- **Integration (component) tests** are the middle: they check several modules working together (a networking layer with storage, and so on). There are fewer of them, and they are slower and harder to set up.
- **E2E (UI) tests** are the top: they walk through user scenarios across the whole interface. There are the fewest of them: they are slow, brittle and expensive to maintain.

The higher the level, the closer the test is to real usage, but the more expensive and slower it is. The pyramid helps you get fast feedback and sufficient coverage without excess cost. An "inverted pyramid" (many UI tests and few unit tests) is considered an anti-pattern: the test suite ends up slow and unstable.
