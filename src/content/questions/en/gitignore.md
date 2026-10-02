---
title: "What is .gitignore for?"
category: git
order: 9
---

`.gitignore` is a file with a list of path patterns that Git does not track and does not add to the repository. It usually lists generated and local files other developers do not need: build artifacts (`build/`, `DerivedData/`), per-user Xcode settings (`xcuserdata/`), `.DS_Store`, dependency folders (`Pods/`, `.build/`), as well as files with secrets and local configuration.

The file lives in the repository root (it can also be placed in subfolders), and its rules only apply to files that are not tracked yet: if a file is already in the repository, you have to remove it from the index with `git rm --cached <file>`. Templates for Swift and Xcode are available on gitignore.io and in the GitHub `gitignore` repository. Personal rules you do not want to share with the team can go into `.git/info/exclude` or a global ignore file.
