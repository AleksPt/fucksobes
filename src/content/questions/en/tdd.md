---
title: "What is TDD? What are its advantages and disadvantages compared to other approaches?"
category: testing
order: 5
---

TDD (Test-Driven Development) is development driven by tests. The **Red–Green–Refactor** cycle:

1. Red: write a test for behavior that isn't implemented yet; it fails.
2. Green: write the minimum code to make the test pass.
3. Refactor: improve the code while keeping the tests green.

**Pros:** tests cover every function that gets written, the code is designed to be testable and loosely coupled, feedback is fast, there is less unnecessary functionality, and refactoring is safe.

**Cons:** a slower start, it requires discipline and experience, and it fits poorly with exploratory code and prototypes, as well as with UI, where the expected result is hard to describe up front. Tests tied to the implementation have to be rewritten often. The alternative is writing tests after the code (test-after), which is faster, but coverage often ends up incomplete.
