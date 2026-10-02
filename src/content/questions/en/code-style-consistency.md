---
title: "How would you introduce shared coding styles and best practices in a team of 20 developers?"
category: tooling
order: 36
---

The main thing is to agree on the rules and automate their enforcement, so that style isn't argued about in code review.

- **A set of rules.** Write the conventions down in a document: take the Swift API Design Guidelines and popular style guides (for example, from Kodeco or Google) as a base, and add the project's specifics.
- **Linter and formatter.** SwiftLint checks the rules from `.swiftlint.yml` and highlights violations in Xcode, and SwiftFormat automatically brings the code to a uniform style. The configurations are stored in the repository.
- **Automation.** Run the linter in a Build Phase, in a pre-commit hook and in CI: the build fails while there are violations.
- **Code Review.** Review against a shared checklist; style comments are handled by automation, and reviewers focus on logic and architecture.
- **Templates and training.** File and component templates, examples of "good" code, and short discussions of decisions at team meetings.

Introduce the rules gradually rather than in a single day, and agree on them as a team so that they are adopted rather than bypassed.
