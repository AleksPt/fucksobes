---
title: "If an app has no tests at all, how would you prioritize writing unit tests? Would you write tests at all?"
category: testing
order: 9
---

Yes, but without trying to cover everything at once; I'd go by value and risk:

- critical business logic first, where bugs are expensive: payments, calculations, authorization, data sync;
- pure functions and code with no dependencies (parsing, formatting, validation): it is the easiest to cover;
- places where bugs show up often or that change often, and every newly fixed bug is first reproduced with a test;
- code that is about to be refactored: tests first pin down the current behavior.

Everything new is written with tests from the start, and coverage of old code is expanded gradually as it is changed. For untestable code, introduce abstractions and Dependency Injection where they are needed, without rewriting everything at once. The goal is not a coverage percentage but confidence in changes and stability of the key scenarios; the tests are hooked up to CI.
