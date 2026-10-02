---
title: "What is a development certificate?"
category: tooling
order: 34
---

A development certificate is a digital certificate that confirms the developer's identity and allows signing builds to run on devices during development. It consists of a key pair: the private key is stored in the Keychain on your Mac, and Apple issues the corresponding public certificate.

It is created through Xcode (Settings → Accounts → Manage Certificates) or in the Apple Developer Portal from a Certificate Signing Request (CSR). It ends up in the development provisioning profile, and the system uses it to verify that the build is signed by a trusted developer.

The difference from a **Distribution certificate**: the latter is used to sign builds submitted to TestFlight and the App Store or distributed Ad Hoc. Losing the private key means you have to create a new certificate, so it is exported to a `.p12` file for backup and for sharing with other team members.
