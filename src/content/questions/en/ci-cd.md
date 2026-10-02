---
title: "Tell me about CI/CD (why it is needed, what tools exist)"
category: tooling
order: 13
---

**CI/CD** (continuous integration and delivery) is a development practice that helps keep code healthy and deliver apps to testers and users. GitHub Actions describes it as a platform for automating builds, tests and deployment.

An example from the Apple ecosystem: **Xcode Cloud** builds the project automatically and often, runs tests and checks, and distributes builds to testers through TestFlight; after review, the version can be released to the App Store. In GitHub Actions, processes are described as workflows in YAML files in `.github/workflows/` and run on runners (Linux, Windows, macOS or self-hosted).
