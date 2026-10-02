---
title: "What is an entitlements file? What does it contain?"
category: tooling
order: 35
---

Entitlements are an `.entitlements` file (a plist) listing the rights and capabilities the app requests from the system. They are signed together with the app, and the system checks that the rights are allowed in the App ID and the provisioning profile.

It specifies, for example:

- `aps-environment` for push notifications (development or production);
- `com.apple.security.application-groups` for App Groups, used to share data between the app and its extensions;
- `keychain-access-groups` for shared Keychain access;
- `com.apple.developer.icloud-*` for iCloud and CloudKit;
- `com.apple.developer.associated-domains` for Universal Links;
- Sign in with Apple, HealthKit, Apple Pay and other capabilities; for macOS, the sandbox parameters (`com.apple.security.app-sandbox`).

Capabilities are added on the **Signing & Capabilities** tab: Xcode updates the file itself and enables the capability in the App ID. If the rights in the file don't match the profile, the build won't launch or can't be signed.
