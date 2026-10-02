---
title: "What are integration tests? What are they used for?"
category: testing
order: 6
---

Integration tests check that several components work correctly together: for example, a networking layer together with parsing and storage, or a repository with a real (in-memory) Core Data database. Unlike unit tests, the dependencies inside the scenario under test are not replaced.

They catch bugs at the seams between modules: incompatible data formats, wrong contracts and call order that unit tests can't see. External systems (a real server) are usually replaced with a test or local server so that the tests stay stable.

Pros: closer to how the app really works. Cons: slower and harder to set up, and when one fails it is harder to find the cause. In the testing pyramid there are fewer of them than unit tests, but more than end-to-end UI tests.
