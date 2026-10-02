---
title: "What is the difference between a Stub and a Mock?"
category: testing
order: 4
---

Both are test doubles that replace a real dependency, but they serve different purposes:

- A **Stub** returns predefined answers to calls. It is used to put the code under test into the desired state (for example, "the server returned a user") and verifies nothing itself.
- A **Mock** remembers how it was used (which methods were called, how many times and with which arguments), and the test verifies exactly that interaction ("`save` was called exactly once").

Besides these there are a Fake (a simplified working implementation, such as an in-memory database), a Spy (records calls while the test does the assertions) and a Dummy (a placeholder object that is passed around but never used). A Stub checks the result, a Mock checks the behavior. Overusing mocks ties tests to the internals of the implementation.
