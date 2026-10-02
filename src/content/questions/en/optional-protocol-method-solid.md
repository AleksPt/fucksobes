---
title: "Which SOLID principle do optional methods violate?"
category: architecture
order: 11
---

Optional methods violate the **Interface Segregation Principle**, because they force clients to depend on protocols with methods they don't need. In Swift, optional requirements are possible only in `@objc` protocols (`@objc optional func`). To comply with ISP:

- split large protocols into smaller ones;
- use extensions with a default implementation to reduce the burden of implementing them.
