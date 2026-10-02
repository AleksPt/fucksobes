---
title: "What are the main principles of a good unit test?"
category: testing
order: 12
---

A good test is described by the **FIRST** principles:

- **Fast**: thousands of tests should run in seconds;
- **Independent**: doesn't depend on other tests or on run order, and doesn't share state with them;
- **Repeatable**: gives the same result in any environment, with no network, random values, real time or external services;
- **Self-validating**: reports "passed" or "failed" on its own, with no manual log inspection;
- **Timely**: written at the right time, together with the code or before it (TDD).

In addition:

- one test checks one behavior, and its name describes it (`test_login_withEmptyPassword_showsError`);
- Arrange–Act–Assert structure, with no logic (loops or conditions) in the test itself;
- it verifies behavior rather than implementation details, so refactoring doesn't break tests;
- dependencies are replaced with stubs.

Priority goes to code that is complex, changes often and matters to the business: the larger, more complex and more important the code, the more it needs tests.
