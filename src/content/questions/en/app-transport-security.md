---
title: "What is App Transport Security (ATS)?"
category: networking
order: 14
---

App Transport Security is a security feature that, by default (since iOS 9), forces an app to use secure connections. It applies to network requests made through `URLSession` and other high-level APIs (`WKWebView` has its own separate setting).

ATS requirements: an HTTPS connection, TLS 1.2 or later, ciphers with forward secrecy, and certificates with a sufficiently strong signature and key length. Insecure (`http://`) requests are blocked and an error appears in the console.

Exceptions are configured in `Info.plist` under the `NSAppTransportSecurity` key:

- `NSAllowsArbitraryLoads` — disables ATS for the whole app (App Store review requires a justification);
- `NSExceptionDomains` — exceptions for specific domains: `NSExceptionAllowsInsecureHTTPLoads`, `NSExceptionMinimumTLSVersion`, `NSIncludesSubdomains`;
- `NSAllowsLocalNetworking` — allows requests on the local network;
- `NSAllowsArbitraryLoadsInWebContent` — for `WKWebView` content.

The recommended approach is not to disable ATS but to move the server to HTTPS, making a targeted exception for the specific domain only if necessary.
