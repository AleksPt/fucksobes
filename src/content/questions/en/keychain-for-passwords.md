---
title: "Why use the Keychain for passwords?"
category: data-storage
order: 5
---

A password saved without encryption is a security risk, and constantly asking the user for the password degrades the experience. The Keychain solves both problems: it is an encrypted database in which the app stores small secrets via `SecItemAdd`, finds them via `SecItemCopyMatching`, updates them via `SecItemUpdate`, and deletes them via `SecItemDelete`.
