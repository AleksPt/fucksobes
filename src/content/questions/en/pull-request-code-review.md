---
title: "What is a Pull/Merge Request? Why are they used? What is Code Review?"
category: git
order: 8
---

A Pull Request (a Merge Request in GitLab) is a request to merge a branch into a target branch (usually `main` or `develop`) on the repository hosting platform. It shows the set of changes (the diff), a description, discussions and the results of automated CI checks. Changes get into the main branch only after the request is approved and the checks pass.

Code Review is the inspection of someone else's changes by another developer before merging. The reviewer looks for bugs and performance or security problems, assesses readability, architecture and compliance with the agreed conventions, leaves comments and asks for changes.

Why: code quality goes up, knowledge about the project spreads across the team, a consistent style is easier to maintain, and bugs are caught before they reach the main branch. Teams usually set up branch protection for this (mandatory review and green CI).
