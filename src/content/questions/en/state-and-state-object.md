---
title: "What are the State and StateObject property wrappers for?"
category: swiftui
order: 9
---

For managing state in the user interface.

**`@State`**

- Stores state directly in the View struct.
- Used for simple values and primitive types.
- SwiftUI automatically updates the display when the state changes.

**`@StateObject`**

- Initializes an object inside the View.
- Manages the state of an object that lives as long as the View itself.
- Suited to more complex objects whose lifecycle shouldn't depend on interface changes.
