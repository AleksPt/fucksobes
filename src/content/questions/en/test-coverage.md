---
title: "What is test coverage?"
category: testing
order: 18
---

Test coverage is a metric showing how much of the code is executed when the tests run. It is usually expressed as a percentage: the lines that were executed divided by the total number of lines.

In Xcode, coverage is enabled in the scheme or in a Test Plan (Options → Code Coverage → Gather coverage), and the report is viewed in the Report navigator (Coverage tab): it shows percentages per target, file and function, and the editor highlights executed and unexecuted lines. From the command line, use `xcodebuild -enableCodeCoverage YES` and `xcrun xccov`.

Coverage shows which code is definitely not being checked, but it doesn't prove the quality of the tests: a line can be executed without a single assertion. One hundred percent coverage is not a goal and is often excessive; usually a reasonable threshold is set for important logic, and the team makes sure coverage doesn't drop.
