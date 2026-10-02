---
title: "Tell me about CI/CD (why it is needed, what tools exist)"
category: tooling
order: 13
---

**CI/CD** (continuous integration and delivery) is a development practice that helps keep code healthy and deliver apps to testers and users. It is needed so that every change is built and checked automatically, bugs are found early, and releasing a version does not depend on manual steps on someone's machine.

Tools:

- **Xcode Cloud** is Apple's CI/CD system: it builds the project automatically and often, runs tests and checks, and distributes builds to testers through TestFlight; after review, the version can be released to the App Store.
- **GitHub Actions** is a platform for automating builds, tests and deployment: processes are described as workflows in YAML files in `.github/workflows/` and run on runners (Linux, Windows, macOS or self-hosted).
- **GitLab CI/CD** is the same for GitLab: a pipeline is described in `.gitlab-ci.yml` and runs on runners, including macOS ones.
- **Jenkins** is an open source automation server that you host yourself; it is used to build, test and deploy software.
- **Bitrise** is a cloud CI/CD platform aimed at mobile development.
- **fastlane** is not a CI service but a tool for automating builds, code signing, screenshots and uploads to TestFlight and the App Store; you run it locally or as steps in any of the CI systems above.
