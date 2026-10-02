---
title: "What is a Workspace? How does xcodeproj differ from xcworkspace?"
category: tooling
order: 44
---

A **Workspace** (`.xcworkspace`) is an Xcode document that groups several projects and related files so that you can work with them as a whole.

What a workspace gives you:

- access to all the files of all the projects included in it from a single window;
- a wider scope: code completion, search and jump to definition work across all of the workspace's projects;
- Xcode itself works out the dependencies between targets of different projects and builds them in the right order; thanks to this, the Swift module of a target in one project can be imported in another project if both are in the same workspace.

Inside an `.xcworkspace` there is `contents.xcworkspacedata`, an XML file with the list of included projects and files, as well as its own `xcuserdata/` and `xcshareddata/` (the same folders as in `.xcodeproj` in meaning, only at the workspace level: for example, a scheme may be stored here if it was saved at the workspace level rather than the project level).

**The difference between `.xcodeproj` and `.xcworkspace`:**

- `.xcodeproj` is a unit of build: one project, described by `project.pbxproj`, with its own targets and settings.
- `.xcworkspace` is a container that groups several `.xcodeproj` files (or one project and its external dependencies) into a single workspace.
- A project by itself doesn't know about other projects; only through a workspace can you link several projects and let them use each other's modules.

In practice you meet `.xcworkspace` first of all through dependency managers. For example, on `pod install` CocoaPods creates a separate `Pods` project and an `.xcworkspace` that combines it with the main `.xcodeproj`, and from then on you must open the project through the workspace rather than directly through the `.xcodeproj`.
