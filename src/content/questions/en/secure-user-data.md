---
title: "Where would you store the user's sensitive data?"
category: data-storage
order: 6
---

In the **Keychain**.

For less sensitive data you can use:

- **UserDefaults** — for non-critical information, such as user settings;
- **File System** — with encryption, if you need to store files;
- **Secure Enclave** — a hardware key manager for private keys (NIST P-256): the key is created inside it and never leaves, and signing and decryption are performed by the Secure Enclave itself; it is not a store for arbitrary data or biometrics.
