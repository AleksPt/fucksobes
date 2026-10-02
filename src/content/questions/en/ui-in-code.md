---
title: "How do you build a UI in code? What are the advantages and disadvantages of this approach?"
category: uikit
order: 86
---

You do by hand everything that Interface Builder does: create views, configure properties, add them to the hierarchy (`addSubview`), turn off the automatic mask conversion (`translatesAutoresizingMaskIntoConstraints = false`) and set constraints through anchors.

```swift
let label = UILabel()
label.translatesAutoresizingMaskIntoConstraints = false
view.addSubview(label)
NSLayoutConstraint.activate([
    label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
    label.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
])
```

Pros: no merge conflicts in XML, the code is easy to review and reuse, there are no string identifiers or `IBOutlet` connections, and it is easier to assemble an interface from components. Cons: a lot of boilerplate, no visual preview (partly replaced by SwiftUI previews and third-party DSLs), and mistakes in constraints show up only at launch. To cut down on code, people use anchor helpers and libraries such as SnapKit.
