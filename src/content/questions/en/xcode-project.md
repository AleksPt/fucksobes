---
title: "What is a Project in Xcode?"
category: tooling
order: 40
---

A **Project** (`.xcodeproj`) is a repository of the files and resources needed to build a product: source code, libraries, frameworks, images, Interface Builder files. The project stores the relationships between these elements and sets default settings for all the targets it contains.

`.xcodeproj` is not a file but a package (a folder that Finder shows as a single item). Inside it:

- **`project.pbxproj`** is a text file (essentially a list of objects) that holds the whole description of the project: references to sources and resources, the grouping of files in the navigator, the list of targets, dependencies between them and build settings. This is where merge conflicts most often occur in team work.
- **`xcuserdata/`** is a specific developer's state: open files, the selected target, breakpoints, and schemes if they were saved only for oneself. This folder is added to `.gitignore`.
- **`xcshareddata/`** holds settings shared across the team: schemes and breakpoints marked as shared, so that they go into git and are the same for everyone.

One project can contain several **targets** (for example, the main app, an extension and unit tests) that use shared files but are built differently.
