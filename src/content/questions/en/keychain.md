---
title: "What is the Keychain? What is it used for?"
category: data-storage
order: 25
---

The Keychain is a protected system store for small pieces of secret data: passwords, tokens, keys, and certificates. The data is stored encrypted, and access to it is controlled by the system; you can require, for example, that a value be available only while the device is unlocked (`kSecAttrAccessible...`) or after biometric authentication.

You work with it through the Security framework, using the `SecItemAdd`, `SecItemCopyMatching`, `SecItemUpdate`, and `SecItemDelete` functions (`kSecClassGenericPassword` and other item classes). Items can be shared between apps from the same developer through an access group and synchronized through iCloud Keychain. Unlike `UserDefaults` and regular files, the Keychain stores secrets encrypted and manages access to them at the system level.
