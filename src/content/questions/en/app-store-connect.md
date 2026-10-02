---
title: "What is App Store Connect and what is it used for?"
category: tooling
order: 29
---

App Store Connect is Apple's web portal and API for managing apps: publishing to the App Store and testing. It is used to:

- create the app record (Bundle ID, name, description, screenshots, price, age rating);
- upload and select builds, submit a version for review (App Review) and release it (immediately or in phases);
- distribute builds to testers through TestFlight;
- manage in-app purchases and subscriptions;
- view analytics: downloads, sales, reviews, usage metrics and crashes;
- manage the team and roles, agreements, and tax and payment information.

Builds get there from Xcode (Archive → Distribute App) or through Transporter and the command line (`xcrun altool`, fastlane). For CI automation there is the App Store Connect API with API keys.
