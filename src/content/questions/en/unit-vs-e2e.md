---
title: "How does a unit test differ from an E2E test?"
category: testing
order: 14
---

A **unit test** checks a small unit of code (a function, a class) in isolation: dependencies are replaced with test doubles. It is fast (milliseconds), stable and shows exactly where the bug is. Developers write them and run them on every commit.

An **E2E test** (end-to-end) checks a user scenario as a whole: from the interface to the server and the database, in conditions as close to real as possible (in iOS, XCUITest). It reveals integration errors and problems in a real scenario, but it is slow (seconds to minutes), brittle (it breaks when the interface changes or because of the network), and the cause of a failure is harder to find.

That is why many unit tests are written, while E2E tests are kept for key scenarios (sign-in, payment, registration), following the testing pyramid. They complement each other: unit tests quickly find errors in logic, and E2E tests confirm that everything works together.
