---
title: "What are the main unit test metrics?"
category: testing
order: 13
---

- **Test coverage**: the share of code executed by tests: line, function and file coverage.
- **Branch coverage**: the share of condition branches (`if`, `switch`, `guard`) that were exercised.
- **Number and share of passing tests**, and the number of failing and flaky tests.
- **Execution time** of the test suite: if it is too slow, people stop running it.
- **Mutation score**: the share of code "mutations" (deliberately introduced bugs) that the tests detected; it shows the quality of the assertions, not just the reach.

Coverage metrics show which code isn't being checked, but they don't guarantee quality: a test can execute a line and verify nothing. So the coverage percentage is used as a guideline (for example, not letting it drop), not as an end in itself.
