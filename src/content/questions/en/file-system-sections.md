---
title: "An app has its own file system, and this file system consists of several sections. Can you name them?"
category: data-storage
order: 10
---

**Documents** — user files, for example PDFs, text documents, images, and other data that should be accessible to the user.

**Library** is divided into several sections:

- **Preferences** — app settings (`UserDefaults` and similar data);
- **Caches** — temporary data that can safely be deleted, for example an image or network data cache.

**tmp** — temporary files: logs, temporary download data, and any other files that can be deleted.

**`<App name>.app`** — the directory with the app itself (the bundle). It contains all the resources shipped with the app: music, images, fonts, and other embedded files, as well as the compiled code.
