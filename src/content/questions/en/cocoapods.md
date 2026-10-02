---
title: "What is CocoaPods and how do you use it?"
category: tooling
order: 25
---

CocoaPods is a dependency manager for Apple-platform projects, written in Ruby. Libraries ("pods") live in a shared registry, and dependencies are described in a `Podfile`.

Usage:

1. Install it: `sudo gem install cocoapods` or via Homebrew (`brew install cocoapods`).
2. Create a `Podfile` (`pod init`) and list the dependencies:

```ruby
platform :ios, '15.0'
use_frameworks!

target 'MyApp' do
  pod 'Alamofire', '~> 5.8'
end
```

3. Run `pod install`: CocoaPods downloads the libraries and creates the `Pods` project, a `Podfile.lock` file (which pins the versions) and an `.xcworkspace`.
4. From then on, the project must be opened through the `.xcworkspace`.

You can update versions with `pod update`. Cons: an extra workspace and changes to project files, a Ruby environment is required, and CocoaPods itself has moved into maintenance mode, with new libraries more often released for SPM.
