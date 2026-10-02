---
title: "How do you distribute a build through App Store Connect and TestFlight?"
category: tooling
order: 31
---

The process is as follows:

1. In App Store Connect, create an app record with the required Bundle ID.
2. In Xcode, select the **Any iOS Device (arm64)** destination and create an archive: **Product → Archive** (a Distribution certificate and profile are required, or automatic signing).
3. In the Organizer, select the archive and click **Distribute App → App Store Connect → Upload**. Xcode signs the build and uploads it.
4. After processing (a few minutes), the build appears in App Store Connect on the TestFlight tab. It is then given to internal and external testers, and for a release you select this build in the app version and submit it for review.

Alternatives to Xcode for uploading: the Transporter app and `xcodebuild -exportArchive`, while CI more often uses fastlane (`gym`, `pilot`) and the App Store Connect API. The build number (`CFBundleVersion`) must be unique for each upload within a version.
