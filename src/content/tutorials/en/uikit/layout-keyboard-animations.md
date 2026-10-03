---
title: "Layout in code, keyboard, animations, what is new in UIKit"
order: 11
---

> **What you'll learn**
>
> - Three approaches to layout (Storyboard/xib, Auto Layout in code, frames) and how to choose
> - How to lay out in code neatly, what SnapKit gives you, and which traps people fall into with it
> - How to keep the keyboard from covering the text field: `keyboardLayoutGuide`
> - Animations: `UIView.animate`, spring, `UIViewPropertyAnimator`
> - Bottom sheet: the system `UISheetPresentationController` and your own `UIPresentationController`
> - `UIButton.Configuration` instead of configuring buttons by hand
> - What is new in UIKit: `updateProperties()`, observation tracking, Liquid Glass

> **Prerequisites:** tutorials [04](../autolayout-constraints/)–[05](../autolayout-layout-pass/) (Auto Layout, the layout cycle), 07 (gestures), 08 (lists, `keyboardDismissMode`), 09 (delegates, `UIAppearance`).

## Analogy: renovating an apartment

- **Storyboard** is a sketch on paper: quick to draw, but hard to read and to merge other people's changes.
- **Auto Layout in code** is rules for arranging furniture, "the sofa by the wall, the table in the center": one arrangement fits any room.
- **Frame** is exact coordinates on a floor plan: it works fast, but every room has to be calculated by hand.
- **The keyboard** is a guest who sits down and blocks the bottom shelf: the furniture has to move aside by itself.
- **Animation** is a rearrangement that you see happen smoothly, rather than an instant jump.

## Step 1. Three approaches to layout

Layout is positioning elements on the screen with the device and screen size in mind. Per the article "Approaches to Layout in UIKit" (a developer's personal assessment, not Apple's documentation):

| Approach | Pros | Cons |
| --- | --- | --- |
| **Storyboard and xib** (Interface Builder) | Easy to get into; quick and visual for simple screens; changes are visible immediately | The layout is stored as XML: hard to read in code review, heavy merge conflicts; errors only at runtime (renamed a class — the app crashed on a transition; the same with cell identifiers and segues); Xcode may lag; not everything can be configured in IB |
| **Auto Layout in code** | The code is readable and reviewable; no crashes from renaming in IB; flexibility and scalability | Harder to get into; the result is visible only when running; more lines |
| **Frame-based layout** | Maximum performance: sizes are computed by hand, without solving a system of equations | Complexity grows, screens get bulky, strong dependence on the controller's lifecycle, slow development, rarely seen |

- The article's main conclusion: there is no perfect approach. Storyboard is cheap to develop but scales poorly (suitable for a small app or an MVP). Auto Layout in code is the "golden mean" for medium and large apps. Frame-based layout — only when every hitch is costly and it is justified by business requirements.
- For frame-based layout the calculation is done in `layoutSubviews()` (in the article — `viewDidLayoutSubviews()`); sizes — in `sizeThatFits`.

As in tutorial [10](../ui-performance/), the fact that frame-based layout is faster than Auto Layout is the article author's claim. A practical rule: measure first, then switch to frames, and only where Auto Layout is really the bottleneck.

## Step 2. Laying out in code neatly

The standard template for a screen without a storyboard: the layout lives in a separate `UIView`, and the controller replaces its root view in `loadView()`. This way the controller isn't cluttered with constraints, and the view can be tested separately.

```swift
final class ProfileView: UIView {
    let avatarView = UIImageView()
    let nameLabel = UILabel()
    let followButton = UIButton(configuration: .filled())      // iOS 15+, step 7
    private let stack = UIStackView()

    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .systemBackground
        setupViews()
        setupConstraints()
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    private func setupViews() {
        nameLabel.font = .preferredFont(forTextStyle: .title2)
        nameLabel.numberOfLines = 0
        followButton.configuration?.title = "Follow"

        stack.axis = .vertical
        stack.spacing = 12
        stack.alignment = .center
        [avatarView, nameLabel, followButton].forEach(stack.addArrangedSubview)
        addSubview(stack)
    }

    private func setupConstraints() {
        stack.translatesAutoresizingMaskIntoConstraints = false
        avatarView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            stack.centerXAnchor.constraint(equalTo: centerXAnchor),
            stack.topAnchor.constraint(equalTo: safeAreaLayoutGuide.topAnchor, constant: 24),
            stack.leadingAnchor.constraint(greaterThanOrEqualTo: layoutMarginsGuide.leadingAnchor),
            stack.trailingAnchor.constraint(lessThanOrEqualTo: layoutMarginsGuide.trailingAnchor),
            avatarView.widthAnchor.constraint(equalToConstant: 96),
            avatarView.heightAnchor.constraint(equalTo: avatarView.widthAnchor)
        ])
    }
}

final class ProfileViewController: UIViewController {
    private let profileView = ProfileView()
    override func loadView() { view = profileView }       // your own root view
}
```

**Rules (tutorial [04](../autolayout-constraints/)):** `translatesAutoresizingMaskIntoConstraints = false` for every view whose constraints you set yourself; activate all constraints with one `NSLayoutConstraint.activate` call; don't leave the layout "incomplete": a view must have both a position and a size (either explicitly or via intrinsic size, tutorial [05](../autolayout-layout-pass/)).

## Step 3. SnapKit and its traps

> **SnapKit** is a third-party library — syntactic sugar and wrappers over `NSLayoutConstraint` for more convenient work with constraints. Per the article "iOS development with SnapKit" (2023): the first release was in 2016, the latest at the time of the article was 5.6.0 (April 2022). Check the current version in the repository.

```swift
// SnapKit
button.snp.makeConstraints {
    $0.center.equalToSuperview()
    $0.top.left.greaterThanOrEqualToSuperview()
}

// the same without the library
button.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
    button.centerXAnchor.constraint(equalTo: view.centerXAnchor),
    button.centerYAnchor.constraint(equalTo: view.centerYAnchor),
    button.topAnchor.constraint(greaterThanOrEqualTo: view.topAnchor),
    button.leadingAnchor.constraint(greaterThanOrEqualTo: view.leadingAnchor)
])
```

**Four methods for managing the list of constraints (per the article):**

- `makeConstraints` — create and activate constraints "from scratch" (sets `translatesAutoresizingMaskIntoConstraints = false` itself);
- `remakeConstraints` — first deactivate all the old ones, then create anew;
- `updateConstraints` — update already created ones; if there is no suitable existing one, you get a `fatalError`;
- `removeConstraints` — remove.

Also `equalToSuperview()` crashes with a `fatalError` if the view has no superview yet: first `addSubview`, then constraints. Combined attributes (`edges`, `horizontalEdges`, `verticalEdges`, `size`, `center`, `margins`...) shorten the code. For debugging there is `labeled(_:)`: the identifier will be visible in the log when constraints conflict.

**Six traps (from the article):**

| Trap | What the problem is | Solution |
| --- | --- | --- |
| 1. An incomplete set of constraints | Only `center` — a button with long text can go beyond the superview, with no layout errors | Add one more inequality per axis (`greaterThanOrEqualTo`) |
| 2. `offset` instead of `inset` | `offset` leaves the constant as is: `right.equalToSuperview().offset(50)` shifts the right edge outward. `inset` flips the sign for the right and bottom edge, so the inset goes inward | For insets from the edges: `edges.equalToSuperview().inset(50)` |
| 3. Redundant constraints | "Playing it safe" (all four sides plus the center) causes unneeded computations, and inside a `UIStackView` — conflicts when the stack changes its axis | A sufficient set is enough; in a stack view the stack chooses the position itself |
| 4. `left` and `leading` | For right-to-left languages `leading` is the right edge | A single style everywhere; usually `leading` and `trailing` (tutorial [04](../autolayout-constraints/)) |
| 5. No relationships between elements | Three labels, each pinned to the superview on its own: with long text they overlap each other with no errors in the console | A chain: `label2.top == label1.bottom + 16`, `label3.top == label2.bottom + 16` |
| 6. `left` and `leftMargin` | A `margin` is the insets inside a view (`layoutMargins`). `leadingMargin.equalToSuperview()` takes the margins of both views and the inset ends up wrong | To pin to the parent's margin: `$0.leading.equalTo(view.snp.leadingMargin)` |

```swift
// trap 5: a chain instead of pinning each label to the superview
label1.snp.makeConstraints { $0.top.horizontalEdges.equalToSuperview() }
label2.snp.makeConstraints {
    $0.top.equalTo(label1.snp.bottom).offset(16)
    $0.horizontalEdges.equalToSuperview()
}
label3.snp.makeConstraints {
    $0.top.equalTo(label2.snp.bottom).offset(16)
    $0.horizontalEdges.bottom.equalToSuperview()
}
```

A useful takeaway from the article: before every constraint ask "will it definitely work correctly?" and "is it definitely needed?". Not everything listed is needed in every project (for example, RTL).

## Step 4. The keyboard: keyboardLayoutGuide

The classic problem: the keyboard covers the text field. It used to be solved by subscribing to `keyboardWillShow` notifications and shifting things by hand. Since iOS 15 there is `view.keyboardLayoutGuide` — a layout guide that represents the space occupied by the keyboard in your layout (`UIKeyboardLayoutGuide`).

**How it works (per Apple's documentation):**

- When the keyboard isn't on screen, the guide lies at the bottom of the window, and its height equals the bottom `safeAreaInsets`. So "pinning to the keyboard" without a keyboard gives an ordinary inset from the safe area.
- When the keyboard appears (docked), the guide matches it. Use it like any other layout guide.
- By default `followsUndockedKeyboard = false`: with an undocked keyboard the guide behaves as if it were hidden. Setting `true` and defining tracking constraints (`setConstraints(_:activeWhenAwayFrom:)`, `activeWhenNearEdge`) is needed only for floating and split keyboards (mainly iPad).
- Constraints attached directly to the guide's anchors are not enabled and disabled automatically — full tracking is provided only by the `setConstraints` methods.

```swift
// an input bar at the bottom of the screen: rises along with the keyboard by itself
inputBar.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
    inputBar.leadingAnchor.constraint(equalTo: view.leadingAnchor),
    inputBar.trailingAnchor.constraint(equalTo: view.trailingAnchor),
    inputBar.bottomAnchor.constraint(equalTo: view.keyboardLayoutGuide.topAnchor)
])

// a list above the input bar, the keyboard is dismissed with a downward gesture
tableView.bottomAnchor.constraint(equalTo: inputBar.topAnchor).isActive = true
tableView.keyboardDismissMode = .interactive        // tutorial 08
```

**Before iOS 15 (notifications).** Now rarer, for supporting old versions. You subscribe to `UIResponder.keyboardWillChangeFrameNotification`, take the final frame (`UIResponder.keyboardFrameEndUserInfoKey`) and the animation duration (`keyboardAnimationDurationUserInfoKey`) from `userInfo`, and change `contentInset` or a constraint inside an animation (tutorials [05](../autolayout-layout-pass/) and [08](../lists/); remove the subscription, tutorial [09](../data-passing-appearance/)).

## Step 5. Animations

In tutorial [02](../calayer-drawing/) we saw that changes to layer properties are animated implicitly, and a view turns this off outside animation blocks. At the UIKit level you have three tools:

| Tool | When |
| --- | --- |
| `UIView.animate(withDuration:...)` | Simple "fire and forget" animations: appearing, shifting, rotating |
| `UIView.animate(springDuration:bounce:...)` (iOS 17+) | A spring animation with "duration and bounce" parameters |
| `UIViewPropertyAnimator` (iOS 10+) | An animation that needs to be paused, rewound, reversed, driven by a gesture |
| `CAAnimation` (explicit) | Fine control over layer properties (tutorial [02](../calayer-drawing/)) |

```swift
// a regular animation; allowUserInteraction — otherwise touches are disabled during the animation (tutorial 06)
UIView.animate(withDuration: 0.3, delay: 0, options: [.curveEaseInOut, .allowUserInteraction]) {
    card.alpha = 1
    card.transform = .identity
} completion: { _ in
    print("done")
}

// spring (iOS 17+)
UIView.animate(springDuration: 0.5, bounce: 0.3) {
    card.center = target
}
```

**`UIViewPropertyAnimator`.** Per Apple's documentation, it lets you animate changes to views and dynamically modify the animation before it finishes. You choose: a block with the changes, a timing curve (built-in, Bézier or spring), the duration, a completion. If you create it through the regular init, an explicit `startAnimation()` is needed (or `runningPropertyAnimator(...)`, which starts immediately). You can start, pause, resume, stop, add blocks after the start, scrub through `fractionComplete`, change direction with `isReversed`, finish with a different curve via `continueAnimation(withTimingParameters:durationFactor:)`.

```swift
let animator = UIViewPropertyAnimator(duration: 0.4, dampingRatio: 0.8) {
    self.card.center = self.target
}
animator.addCompletion { position in
    if position == .end { print("reached the end") }
}
animator.startAnimation()

// interactively (for example, with a pan gesture)
animator.pauseAnimation()
animator.fractionComplete = progress              // 0...1 — scrub with the finger
animator.continueAnimation(withTimingParameters: nil, durationFactor: 0)   // finish
```

**Animating constraints** — tutorial [05](../autolayout-layout-pass/): change `constant` before the block, inside the block call `layoutIfNeeded()` on the root view.

A nuance of explicit `CAAnimation`s (from the article "How UI works in iOS"): the animation changes the `presentationLayer` (a copy of the layer at the current moment), while the model values of the properties stay the same; so after the animation ends the layer returns to the model values unless you set `isRemovedOnCompletion = false`. For touches on an animated element, hit-testing relies on the model frame (tutorial [06](../touches-hittest/)).

## Step 6. Bottom sheet

**The system one: `UISheetPresentationController` (iOS 15+).** Per Apple's documentation, it lets you present a view controller as a sheet. The size is set by **detents** — the heights at which the sheet can "stop". It is configured before presentation in the controller's `sheetPresentationController`.

```swift
let details = DetailsViewController()
if let sheet = details.sheetPresentationController {
    sheet.detents = [.medium(), .large()]
    sheet.largestUndimmedDetentIdentifier = .medium     // up to medium the background isn't dimmed and stays interactive
    sheet.prefersGrabberVisible = true
    sheet.prefersScrollingExpandsWhenScrolledToEdge = false
}
present(details, animated: true)
```

There is an `invalidateDetents()` method to recompute custom detents and `animateChanges(_:)` to animate changes to the sheet's properties.

**Your own bottom sheet — `UIPresentationController` (the Joom article).** It is needed when the design goes beyond the system sheet. The idea: the presentation controller is responsible for presentation (adds the view to the hierarchy, sets the position, accounts for the content size and dimming), and the animation lives in an object that implements `UIViewControllerAnimatedTransitioning`. Interactive dismissal is done with `UIPercentDrivenInteractiveTransition` and a pan gesture.

- `modalPresentationStyle = .custom` and `transitioningDelegate`; a view controller's `transitioningDelegate` is `weak`, so you have to hold a strong reference to the delegate yourself;
- the position is set by `frameOfPresentedViewInContainerView`; the content size — via the controller's `preferredContentSize`, changes — via `preferredContentSizeDidChange(forChildContentContainer:)`; the animation on a size change must be set up by you;
- if there is a scroll view inside, the gestures conflict (tutorial [07](../responder-chain-gestures/)): dismissal begins only when `contentOffset` is at the top and the scroll goes down; `UIScrollView` already has a `delegate`, so the article uses a "multicast delegate" proxy so as not to overwrite someone else's;
- a `UINavigationController` inside a sheet doesn't react to a decrease of `preferredContentSize` and doesn't animate the size on push and pop, so the article writes its own subclass and its own transition.

```swift
final class SheetPresentationController: UIPresentationController {
    override var frameOfPresentedViewInContainerView: CGRect {
        guard let container = containerView else { return .zero }
        let height = min(presentedViewController.preferredContentSize.height, container.bounds.height * 0.9)
        return CGRect(x: 0, y: container.bounds.height - height, width: container.bounds.width, height: height)
    }

    override func preferredContentSizeDidChange(forChildContentContainer container: UIContentContainer) {
        UIView.animate(withDuration: 0.25) {
            self.presentedView?.frame = self.frameOfPresentedViewInContainerView
        }
    }
}

final class SheetTransitioningDelegate: NSObject, UIViewControllerTransitioningDelegate {
    func presentationController(forPresented presented: UIViewController,
                                presenting: UIViewController?,
                                source: UIViewController) -> UIPresentationController? {
        SheetPresentationController(presentedViewController: presented, presenting: presenting)
    }
}

// presenting
private let sheetDelegate = SheetTransitioningDelegate()       // a strong reference
let vc = ContentViewController()
vc.modalPresentationStyle = .custom
vc.transitioningDelegate = sheetDelegate
present(vc, animated: true)
```

## Step 7. UIButton.Configuration

Per Apple's documentation, `UIButton.Configuration` (iOS 15+) is a structure that defines the appearance and behavior of a button and its content. It replaces methods like `setTitle(_:for:)` and can work together with them.

| Style | What it gives |
| --- | --- |
| `plain()`, `borderless()` | A transparent background or no border |
| `gray()`, `tinted()`, `filled()` | Gray, a tint-color shade, filled with the tint color |
| `bordered()`, `borderedTinted()`, `borderedProminent()` | With a border, including prominent ones |
| `glass()`, `clearGlass()`, `prominentGlass()`, `prominentClearGlass()` | Liquid Glass (iOS 26) |

Configurable properties: `title`, `subtitle`, `image`, `imagePlacement`, `imagePadding`, `contentInsets`, `baseBackgroundColor`, `baseForegroundColor`, `cornerStyle`, `buttonSize`, `showsActivityIndicator`, `indicator`, `automaticallyUpdateForSelection`.

```swift
var config = UIButton.Configuration.filled()
config.title = "Buy"
config.subtitle = "from $3.99"
config.image = UIImage(systemName: "cart")
config.imagePlacement = .leading
config.imagePadding = 8
config.cornerStyle = .capsule
config.baseBackgroundColor = .systemBlue
button.configuration = config

// the "loading" state: an indicator instead of the image
button.configuration?.showsActivityIndicator = true
```

The link with tutorial [09](../data-passing-appearance/): instead of struggling with `UIAppearance` and `layer.cornerRadius` for buttons, use `cornerStyle` and the colors in the configuration.

## Step 8. Hiding the tab bar

There is a `setTabBarHidden` function that shifts `tabBar.frame` down by the bar's height in an animation and then sets `isHidden`. It is a workable solution for simple cases, but it has limitations, and for modern iOS versions there is a standard way.

```swift
// iOS 18+: the standard way
tabBarController?.setTabBarHidden(true, animated: true)

// hide the bottom bar on a screen that is being pushed (versions before iOS 18)
let details = DetailsViewController()
details.hidesBottomBarWhenPushed = true
navigationController?.pushViewController(details, animated: true)
```

The `hidesBottomBarWhenPushed` property is described in Apple's documentation as hiding the bottom bar (toolbar) on a push in a navigation controller; that it also hides the tab bar is well-known practice, but Apple's page doesn't directly confirm it.

## Step 9. What is new in UIKit

**1. Observation tracking and `updateProperties()`.**

Classically, when the model changes you have to mark views for update yourself (`setNeedsLayout`, `setNeedsDisplay`) — the developer has to remember when and where to invalidate. Apple's documentation: if the model is marked with the `@Observable` macro, UIKit itself tracks its properties that you read in special methods and updates the view when they change. Such methods are: `updateProperties()` (on a view and on a view controller) and `layoutSubviews()`; for cells — `configurationUpdateHandler`.

- `updateProperties()` — for what doesn't affect geometry (text, colors, visibility); `layoutSubviews()` — for geometry. This avoids extra layout passes.
- To request an update manually: `setNeedsUpdateProperties()`.
- In iOS 18 automatic tracking is **not enabled by default**: you need to add the `UIObservationTrackingEnabled` key with the value `true` to `Info.plist`. For the same tracking in iOS 18, a view controller uses `viewWillLayoutSubviews()`. For newer versions, check Apple's current notes.

```swift
@Observable
final class MessageModel {
    var showStatus = false
    var statusText = ""
}

final class InboxViewController: UIViewController {
    private let model = MessageModel()
    private let statusLabel = UILabel()

    override func updateProperties() {
        super.updateProperties()
        statusLabel.alpha = model.showStatus ? 1 : 0       // we read the model's properties — UIKit remembers the dependency
        statusLabel.text = model.statusText
    }
}
```

**The order of the update pass (Apple):** updating the trait collection, `updateProperties()`, `layoutSubviews()`, rendering (display), presenting the frame. If a step triggers updates of other views, the process repeats. This complements the cycle from tutorial [05](../autolayout-layout-pass/): before layout there is now a "properties" step as well. UIKit may skip `updateProperties()` or `layoutSubviews()` if there is nothing to update.

**2. Liquid Glass (iOS 26).** Per the WWDC25 session "Build a UIKit app with the new design": the basis of the new design is the Liquid Glass material. System components are updated: `UITabBarController` and `UISplitViewController` got a new look, navigation bars and toolbars "float" above the content. For your own elements there is `UIGlassEffect` (the `.regular` and `.clear` styles) and ready-made button styles (step 7).

```swift
let button = UIButton()
button.configuration = .glass()                 // iOS 26+
button.configuration?.title = "Glass"

let effectView = UIVisualEffectView(effect: UIGlassEffect(style: .regular))   // iOS 26+
```

**3. Other things from earlier versions** (already encountered in the tutorials): `keyboardLayoutGuide` (iOS 15), the system sheet and `UIButton.Configuration` (iOS 15), cell configurations (iOS 14), diffable data source (iOS 13), spring animations with `springDuration` (iOS 17).

> **The chapter's boundary.** What appeared in iOS 27 and in articles after WWDC26 isn't covered here: see Apple - "What's new in UIKit".

## Common mistakes

- Renaming a screen's class and forgetting it in Interface Builder: a runtime crash.
- Frame-based layout without measurement: complex code with no real benefit.
- Forgetting `translatesAutoresizingMaskIntoConstraints = false` when laying out in code (tutorial [04](../autolayout-constraints/)).
- With SnapKit: a lone `center` without constraints on the edges; `offset` instead of `inset` for the right and bottom inset.
- Pinning every view to the superview rather than to each other: the layout "floats" with long text.
- Confusing `left` and `leftMargin`.
- Calling `equalToSuperview()` before `addSubview`: a `fatalError`.
- Thinking `keyboardLayoutGuide` requires `followsUndockedKeyboard = true`: for a docked keyboard it isn't needed.
- Relying on tracking constraints without `setConstraints(...)`: they aren't enabled automatically.
- An animation without `.allowUserInteraction` when you need to respond to touches during the animation.
- `UIViewPropertyAnimator` without `startAnimation()`: nothing will happen.
- Keeping `transitioningDelegate` only as weak with no strong reference outside: it gets deallocated and the presentation breaks.
- Writing your own bottom sheet when `UISheetPresentationController` is enough.
- Hand-styling buttons through `layer.cornerRadius` and `backgroundColor` when `UIButton.Configuration` exists.
- Allowing observation tracking in iOS 18 without the `UIObservationTrackingEnabled` key: tracking won't work.
- Putting geometry calculation in `updateProperties()`: geometry belongs in `layoutSubviews()`.

<details>
<summary>If the screen has only a text field and the keyboard, can you do without observing notifications?</summary>

Yes, since iOS 15: pin the bottom edge of the field or bar to `view.keyboardLayoutGuide.topAnchor`. When there is no keyboard, the guide lies at the bottom of the window with the height of the bottom safe area inset, and when the keyboard appears it matches it. For lists you add `keyboardDismissMode = .interactive`.

</details>

## Cheat sheet

```swift
// Layout: Auto Layout in code; the root view in loadView(); translatesAutoresizingMaskIntoConstraints = false; NSLayoutConstraint.activate([...])
// SnapKit: makeConstraints / remakeConstraints / updateConstraints / removeConstraints
//   inset for insets from the edges; a chain between elements; left versus leftMargin

// Keyboard (iOS 15)
inputBar.bottomAnchor.constraint(equalTo: view.keyboardLayoutGuide.topAnchor)
// followsUndockedKeyboard = true and setConstraints(_:activeWhenAwayFrom:) — only for floating/split

// Animations
UIView.animate(withDuration: 0.3, delay: 0, options: [.allowUserInteraction]) { ... }
UIView.animate(springDuration: 0.5, bounce: 0.3) { ... }          // iOS 17
let a = UIViewPropertyAnimator(duration: 0.4, dampingRatio: 0.8) { ... }; a.startAnimation()
a.pauseAnimation(); a.fractionComplete = p; a.continueAnimation(withTimingParameters: nil, durationFactor: 0)

// Sheet
sheet.detents = [.medium(), .large()]; sheet.prefersGrabberVisible = true      // iOS 15
// your own: UIPresentationController + UIViewControllerTransitioningDelegate (a strong reference to the delegate)

// Buttons
var c = UIButton.Configuration.filled(); c.title = "..."; c.cornerStyle = .capsule; button.configuration = c

// New
override func updateProperties() { super.updateProperties(); label.text = model.text }     // @Observable; iOS 18: UIObservationTrackingEnabled
// iOS 26: .glass() on UIButton.Configuration, UIGlassEffect
```

## Self-check questions

<details>
<summary>1. What are the three approaches to layout and their pros and cons?</summary>

Storyboard — quick and visual, but hard to read in review, merge conflicts, runtime errors. Auto Layout in code — readable and scalable, but harder to get into. Frame — maximum performance, but expensive and bulky code (the article author's assessment).

</details>

<details>
<summary>2. What is the difference between offset and inset in SnapKit?</summary>

`offset` leaves the constant as is (the sign doesn't change). `inset` inverts the sign for the right and bottom edge so that the inset goes inward into the parent.

</details>

<details>
<summary>3. How do you keep a text field from ending up under the keyboard? Is it true that followsUndockedKeyboard = true is needed?</summary>

Pin it to `view.keyboardLayoutGuide.topAnchor`. `followsUndockedKeyboard` is needed only to track a floating and split keyboard and for tracking constraints; for the usual docked keyboard it isn't needed.

</details>

<details>
<summary>4. How does UIViewPropertyAnimator differ from UIView.animate?</summary>

It lets you control the animation while it runs: pause, resume, scrub through `fractionComplete`, reverse with `isReversed`, add blocks, change timing. The start is an explicit `startAnimation()`.

</details>

<details>
<summary>5. When to use the system UISheetPresentationController and when your own UIPresentationController?</summary>

The system one by default (iOS 15+, detents, grabber, settings). Your own — when the design doesn't fit its capabilities: the position, dimming, animation and interactive dismissal are handled by a pair of a presentation controller, a transitioning delegate and an interactive transition.

</details>

<details>
<summary>6. What is UIButton.Configuration and why use it?</summary>

A structure (iOS 15+) that defines a button's look and behavior: the style (`filled`, `tinted`, `gray`...), title, subtitle, image, insets, corners, a loading indicator. It replaces hand configuration via `setTitle` and `layer`.

</details>

<details>
<summary>7. What is observation tracking in UIKit and what is updateProperties()?</summary>

UIKit automatically tracks the properties of an `@Observable` model that are read in `updateProperties()`, `layoutSubviews()` and cell handlers, and re-runs them when they change. `updateProperties()` is for configuring content and styles, and runs before layout. In iOS 18 it is enabled by the `UIObservationTrackingEnabled` key.

</details>

## Sources

- [UIKeyboardLayoutGuide — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uikeyboardlayoutguide)
- [Adjusting your layout with keyboard layout guide — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/adjusting-your-layout-with-keyboard-layout-guide)
- [UIViewPropertyAnimator — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uiviewpropertyanimator)
- [UIView animate with springDuration — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uiview/animate(springduration:bounce:initialspringvelocity:delay:options:animations:completion:))
- [UISheetPresentationController — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uisheetpresentationcontroller)
- [UIButton.Configuration — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uibutton/configuration-swift.struct)
- [Updating views automatically with observation tracking in UIKit — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/updating-views-automatically-with-observation-tracking-in-uikit)
- [Build a UIKit app with the new design — WWDC25 (Apple)](https://developer.apple.com/videos/play/wwdc2025/284/)
- [What’s New in UIKit iOS 26 — sebvidal.com](https://sebvidal.com/blog/whats-new-in-uikit-26/)
- [Approaches to Layout in UIKit — AppTractor (in Russian)](https://apptractor.ru/info/articles/podhody-k-verstke-v-uikit.html)
- [Using the new keyboardLayoutGuide — AppTractor (in Russian)](https://apptractor.ru/info/articles/ispolzuem-novyy-keyboardlayoutguide-chtoby-spastis-ot-klaviatury.html)
- [iOS development with SnapKit — Habr (in Russian)](https://habr.com/ru/companies/sravni/articles/719474/)
- [Bottom Sheet, let's be on a first-name basis — Habr (in Russian)](https://habr.com/ru/companies/joom/articles/596821/)
- [How UI works in iOS — sidorov.tech (in Russian)](https://sidorov.tech/all/ustroystvo-ui-v-ios/)
- [Layout in code with SnapKit in Swift — YouTube (in Russian)](https://youtu.be/wTL7Ju4-3Kg?si=R4rBJI6copFho8Gp)
- [Building a UIKit user interface programmatically — Hacking with Swift](https://www.hackingwithswift.com/read/8/2/building-a-uikit-user-interface-programmatically)
- [WTF Auto Layout](https://www.wtfautolayout.com/?example=true)
- [Find A Problematic View In The View Debugger — dasdom.dev](https://dasdom.dev/find-a-view-in-view-debugger/)
- [Corner Radius, Shadows, Borders — Advanced Swift](https://www.advancedswift.com/corners-borders-shadows/)
- [NSAttributedString: Formatting Rich Text in Swift — swiftyplace](https://www.swiftyplace.com/blog/nsattributedstring-swift)
- [How to implement a tab bar with a non-standard button: CAShapeLayer and UIResponderChain — Habr (in Russian)](https://habr.com/ru/companies/simbirsoft/articles/550994/)
- [Pop up! Transitions in iOS — Habr (in Russian)](https://habr.com/ru/companies/dododev/articles/463527/)
- [Bottom sheet: Custom transitioning — Habr (in Russian)](https://habr.com/ru/companies/koshelek/articles/697962/)
- [iOS 18 for developers: key changes in UIKit — Habr (in Russian)](https://habr.com/ru/companies/kts/articles/852764/)
- [Automatic Observation Tracking in UIKit and AppKit — Peter Steinberger](https://steipete.me/posts/2025/automatic-observation-tracking-uikit-appkit)
- [How to keep a timer running — Habr (in Russian)](https://habr.com/ru/companies/ecom_tech/articles/867660/)
- [Styling buttons is no easy job, Evgeny Yolchev — YouTube (in Russian)](https://www.youtube.com/watch?v=4Twa-pnuON0)
- [A workshop on creating animations in iOS — Mad Brains Techno, YouTube (in Russian)](https://www.youtube.com/watch?v=zrFqpRelI9I&list=PLw6SJ6q6-1YowmlGVks5a088XrSbihJu-&index=42)
- [Screen rotation in iOS, Fullscreen in iOS — Mad Brains Techno, YouTube (in Russian)](https://www.youtube.com/watch?v=FiJwdnYHoVY&list=PLw6SJ6q6-1YowmlGVks5a088XrSbihJu-&index=30)
- [How to work in the background in iOS — Mad Brains Techno, YouTube (in Russian)](https://www.youtube.com/watch?v=6M9XzvDpKHI&list=PLw6SJ6q6-1YowmlGVks5a088XrSbihJu-&index=38)
