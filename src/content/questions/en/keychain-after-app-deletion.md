---
title: "Is it true that Keychain data remains on the device after the app is deleted?"
category: data-storage
order: 7
---

Yes, on iOS Keychain items survive app deletion. An Apple DTS engineer writes that Keychain access is tied to the provisioning profile the app is signed with, and the data persists after deletion.

This behavior is undocumented: according to the same engineer, it is an implementation detail, and the Keychain documentation never specified it. An attempt to change it in an iOS 10.3 beta caused compatibility problems and was reverted before release. If you need an item to disappear along with the app, Apple recommends tying it to a random key stored on disk (in the app's files, which are deleted together with it).
