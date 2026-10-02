---
title: "What are Storyboard, Xib and Nib? How do they differ? What are they used for?"
category: uikit
order: 75
---

These are ways to describe an interface visually in Interface Builder rather than in code.

- **Xib** is a file (XML) describing one or several views, for example a cell or a single screen. At build time it is compiled into a **Nib**, a binary resource that the app loads at runtime (`UINib`, `Bundle.loadNibNamed`). In other words, a Xib is the source and a Nib is the result of compiling it; in conversation people often mix them up.
- **Storyboard** is a file that describes a set of screens (`UIViewController`) and the transitions between them (segues) on a single canvas. It is compiled into a set of nib files.

Pros: clarity, fast layout, setting up Auto Layout with the mouse, previews for different devices. Cons: merge conflicts in the XML are hard to resolve, errors are discovered only at runtime (string identifiers, `IBOutlet`), and it is harder to reuse code and isolate screens. That is why many teams build the interface in code or in SwiftUI.
