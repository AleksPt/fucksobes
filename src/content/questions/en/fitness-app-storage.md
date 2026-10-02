---
title: "In a fitness app, where would you store: the login, workout information, information about showing an alert, and images?"
category: data-storage
order: 9
---

The login (credentials) goes in the Keychain: it is an encrypted store for passwords and other secrets. Information about showing an alert (for example, an "already shown" flag) goes in `UserDefaults`: it suits non-secret app settings and configuration.

Workout data created by the user and their images can be stored as files in the `Documents` directory (user content, included in the backup). Images the app can recreate (for example, thumbnails) go in `Library/Caches`: they are not included in the backup, and the system may delete them.
