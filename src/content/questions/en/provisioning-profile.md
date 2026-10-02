---
title: "What is a provisioning profile?"
category: tooling
order: 33
---

A provisioning profile is an Apple file that ties together the app, the developer and the devices, allowing the build to run and be installed on them. It contains:

- the App ID (the Bundle ID and enabled capabilities);
- the certificates of developers who can sign the build;
- a list of devices (UDIDs) for development and Ad Hoc profiles;
- entitlements, the rights the app is allowed.

Types of profiles: **Development** (running on registered devices during development), **Ad Hoc** (distribution to a limited number of registered devices), **App Store** (publishing to the App Store and TestFlight, no device list needed) and **Enterprise** (internal distribution within an organization).

The profile is embedded in the app at signing time (`embedded.mobileprovision`), and at installation the system checks that the signature, App ID and device match. Xcode with automatic signing (Automatically manage signing) creates and updates profiles itself.
