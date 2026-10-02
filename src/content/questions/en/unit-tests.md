---
title: "What are unit tests? What are they for?"
category: testing
order: 1
---

A unit test is an automated check of one small unit of code (a function, method or class) in isolation from the rest of the system. Dependencies such as the network, a database and time are replaced with test doubles, so the tests are fast and deterministic.

They are used to:

- find bugs quickly and pinpoint where they occurred;
- refactor safely: if the tests pass, the behavior hasn't changed;
- document the expected behavior of the code with examples;
- catch regressions automatically (in CI on every change).

In iOS they are written with XCTest or Swift Testing (`@Test`, `#expect`). Unit tests form the base of the testing pyramid: there should be the most of them, with fewer integration and UI tests.
