---
title: "How do you pass data between view controllers?"
category: uikit
order: 120
---

The method depends on the direction of the transfer.

**Forward (to the next screen):**

- through the initializer: `DetailViewController(item: item)`; the best option, because the dependency is required and immutable;
- through a property before presenting: `detail.item = item; navigationController?.pushViewController(detail, animated: true)`;
- when using a segue, in `prepare(for:sender:)`: cast `segue.destination` to the needed type and fill in its properties.

**Backward (to the previous screen):**

- a delegate: a protocol with methods that the second screen calls; make the delegate reference `weak`;
- a callback closure: `detail.onSave = { [weak self] item in ... }`;
- an unwind segue in Storyboard;
- Combine/`@Published` or `AsyncStream` for a stream of values.

**Between unrelated screens:** a shared model or service (via DI), `NotificationCenter` for broadcast events, a Coordinator that receives data from one screen and passes it to another.

Avoid global variables and singletons for passing state: they hide dependencies and complicate testing. In SwiftUI, `@Binding`, `@Environment` and `@Observable` are used for this.
