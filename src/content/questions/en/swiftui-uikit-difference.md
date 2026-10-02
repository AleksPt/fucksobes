---
title: "How does SwiftUI differ from UIKit?"
category: swiftui
order: 20
---

**UIKit** is a mature imperative framework: views are reference types (`UIView`) that you create, configure through properties (`view.backgroundColor = .red`) and update manually. It gives maximum control, has a huge ecosystem, and remains a reliable choice for complex, resource-intensive screens and custom graphics.

**SwiftUI** is a declarative framework: you describe what the interface looks like for the current state, and the framework itself takes care of updating it. Views are lightweight structs, the interface is a function of state, the code works the same on all Apple platforms, and animations and transitions are simpler to build.

They are usually combined: `UIHostingController` embeds SwiftUI into UIKit, and `UIViewRepresentable` / `UIViewControllerRepresentable` embed UIKit into SwiftUI.
