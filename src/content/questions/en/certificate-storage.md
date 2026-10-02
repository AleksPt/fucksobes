---
title: "Where should a certificate be stored on the device: in UserDefaults, in the Keychain, or in a local file in the Documents directory?"
category: data-storage
order: 8
---

In the Keychain. The Keychain stores secrets and cryptographic keys with certificates: it is an encrypted database for small amounts of sensitive data.

`UserDefaults` is meant for non-secret app settings, and the `Documents` directory is for user content that may be exposed to the user through file sharing, so a certificate does not belong in either of them.
