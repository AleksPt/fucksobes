---
title: "What is a bundle identifier?"
category: tooling
order: 32
---

A bundle identifier (Bundle ID) is an app's unique identifier in reverse-domain notation, for example `com.company.myapp`. It is set in the target settings and stored in `Info.plist` (`CFBundleIdentifier`).

It is needed to:

- unambiguously distinguish the app in the system and in the App Store: two apps with the same Bundle ID cannot be installed;
- tie the app to the provisioning profile, certificates and the record in App Store Connect;
- determine access to capabilities (Push, Keychain groups, App Groups, iCloud) through the App ID;
- distinguish builds for different environments: for example, `com.company.myapp.dev` for a test build, so that both the dev and production versions can be installed on a device.

After publishing to the App Store, the Bundle ID cannot be changed. For extensions, use identifiers prefixed with the main app's identifier.
