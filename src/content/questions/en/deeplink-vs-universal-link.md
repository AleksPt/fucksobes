---
title: "How do a deeplink (URL scheme) and a Universal Link differ? What is needed for Universal Links to work?"
category: uikit
order: 123
---

**A deeplink via a custom URL scheme** (`myapp://product/42`): the scheme is registered in `Info.plist` (`CFBundleURLTypes`). The link opens the app if it is installed; if not, there is an error. The scheme is not unique: another app can claim the same one. It suits internal navigation, but it is insecure and has no web fallback.

**A Universal Link** is an ordinary HTTPS link (`https://example.com/product/42`) that opens the app if it is installed and otherwise opens the website in the browser. The domain belongs to you and is verified, so the link cannot be hijacked.

What is needed for Universal Links:

1. The **Associated Domains** capability with an `applinks:example.com` entry.
2. An `apple-app-site-association` file (JSON without an extension) on the server at `https://example.com/.well-known/apple-app-site-association`: served over HTTPS, without redirects, containing the app identifier (`TeamID.BundleID`) and a list of paths.
3. Handling the link in the app: `scene(_:continue:)` or `application(_:continue:restorationHandler:)` with `NSUserActivityTypeBrowsingWeb` (in SwiftUI, `onOpenURL`).

Caveats: the link must be tapped by the user (typing it into Safari's address bar opens the website), and the system caches the file through Apple's CDN, so changes are not applied immediately.
