---
title: "What is the difference between pod repo update and pod update?"
category: tooling
order: 47
---

Both are CocoaPods commands, but they update completely different things.

- **`pod update`** updates **your project's** dependencies. With no arguments it updates all pods in the `Podfile` to the latest versions allowed by its constraints, ignoring the versions pinned in `Podfile.lock`. With the name of a specific pod (`pod update Alamofire`) it updates only that pod, leaving the other pinned versions untouched.
- **`pod repo update`** updates the **local cache of the pod registry** (`~/.cocoapods/repos`), that is, the list of all available pods and their versions that CocoaPods knows about on your machine. This command doesn't touch your project or any files in its folder at all; it only updates the local copy of the specs repository.

When you need `pod repo update`: if you (or someone on the team) have just published a new version of a pod and CocoaPods doesn't know about it locally yet, `pod install`/`pod update` won't see the new version until the local registry is updated. A typical symptom is an error in CI saying the spec for a just-added library wasn't found; after `pod repo update`, CocoaPods learns about it and can install it.

In practice `pod install` and `pod update` periodically update part of the registry implicitly on their own, but an explicit `pod repo update` is the most reliable way to get an up-to-date list of versions before investigating why the version you need "can't be found".
