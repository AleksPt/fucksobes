---
title: "What are snapshot tests? What are they for?"
category: testing
order: 8
---

A snapshot test compares the current output with a previously saved reference. In iOS this is most often an image of a rendered `UIView`, `UIViewController` or SwiftUI view: on the first run the reference is recorded, and on later runs the new snapshot is compared with it, and the test fails if they differ. A popular library is `swift-snapshot-testing` by Point-Free; snapshots can also be textual (a hierarchy dump, JSON).

They are used to catch unintended visual regressions: broken layout, shifted elements, lost colors. One test replaces dozens of checks of individual element properties, and it is easy to run across different screen sizes, themes and font sizes.

Cons: the references are stored in the repository and make it larger, the result depends on the OS version and the simulator device, and any intentional design change requires updating the snapshots.
