---
title: "There are two app releases (3.62 and 3.61). QA says a bug reproduces in 3.62 but was not present in 3.61. There are 100 commits between the releases, and a build takes 10 minutes. What would you do?"
category: git
order: 4
---

I would find the offending commit with a binary search (`git bisect`).
