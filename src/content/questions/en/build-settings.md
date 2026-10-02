---
title: "What are Build Settings?"
category: tooling
order: 42
---

A **Build Setting** is a variable that holds information about how a particular aspect of the build process should be carried out: for example, the Swift language version, compiler optimization flags, the header search path, the bundle identifier, the optimization level and dozens of other parameters.

Settings are defined at several levels, and a more specific level overrides a more general one:

1. the platform default value;
2. a value from an `.xcconfig` file attached at the project level;
3. a value set manually at the project level;
4. a value from an `.xcconfig` file attached at the target level;
5. a value set manually at the target level, which has the highest priority.

Besides the built-in ones, you can declare your own **User-Defined** settings, variables that are then used, for example, in Run Script phases or in `Info.plist` via `$(MY_SETTING)`.

It is convenient to move settings into `.xcconfig` files instead of editing them by hand in the Xcode UI: they are easier to review in a diff, reuse across targets and keep under version control, without touching the unwieldy `project.pbxproj`.
