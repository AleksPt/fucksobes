---
title: "Вёрстка кодом, клавиатура, анимации, новое в UIKit"
order: 11
---

> **Что узнаешь**
>
> - Три подхода к вёрстке (Storyboard/xib, Auto Layout кодом, frame) и как выбрать
> - Как верстать кодом аккуратно и что даёт SnapKit, и в какие ловушки при нём попадают
> - Как не дать клавиатуре перекрыть поле ввода: `keyboardLayoutGuide`
> - Анимации: `UIView.animate`, spring, `UIViewPropertyAnimator`
> - Bottom sheet: системный `UISheetPresentationController` и свой `UIPresentationController`
> - `UIButton.Configuration` вместо ручной настройки кнопок
> - Новое в UIKit: `updateProperties()`, observation tracking, Liquid Glass

> **Нужно знать заранее:** туторы [04](../autolayout-constraints/)–[05](../autolayout-layout-pass/) (Auto Layout, цикл компоновки), 07 (жесты), 08 (списки, `keyboardDismissMode`), 09 (делегаты, `UIAppearance`).

## Аналогия: ремонт квартиры

- **Storyboard** — эскиз на бумаге: быстро рисовать, но трудно читать и сливать чужие правки.
- **Auto Layout кодом** — правила расстановки мебели «диван у стены, стол в центре»: одна расстановка подходит к любой комнате.
- **Frame** — точные координаты на плане: быстро работает, но каждую комнату считать вручную.
- **Клавиатура** — гость, который садится и закрывает нижнюю полку: мебель должна сама подвинуться.
- **Анимация** — перестановка, которую видно плавно, а не мгновенный скачок.

## Шаг 1. Три подхода к вёрстке

Вёрстка — позиционирование элементов на экране с учётом устройства и размера экрана. По статье «Подходы к верстке в UIKit» (авторская оценка разработчика, не документация Apple):

| Подход | Плюсы | Минусы |
| --- | --- | --- |
| **Storyboard и xib** (Interface Builder) | Лёгкий вход; быстро и наглядно для простых экранов; видны изменения сразу | Расчёт в XML: трудно читать на code review, тяжёлые конфликты слияния; ошибки только в runtime (переименовали класс — приложение упало при переходе; так же с идентификаторами ячеек и segue); Xcode может тормозить; не всё настраивается в IB |
| **Auto Layout кодом** | Код читается и ревьюится; нет крашей от переименования в IB; гибкость и масштабируемость | Вход сложнее; результат видно только при запуске; больше строк |
| **Frame-вёрстка** | Максимальная производительность: размеры считаются вручную, без решения системы уравнений | Сложность растёт, экраны громоздкие, сильная завязка на жизненный цикл контроллера, медленная разработка, редко встречается |

- Главный вывод статьи: идеального подхода нет. Storyboard — дешёвый в разработке, но плохо масштабируется (подходит для маленького приложения или MVP). Auto Layout кодом — «золотая середина» для средних и больших приложений. Frame-вёрстка — только когда каждый hitch дорого стоит и это обосновано бизнес-требованиями.
- Для frame-вёрстки расчёт делают в `layoutSubviews()` (в статье — `viewDidLayoutSubviews()`); размеры — в `sizeThatFits`.

Как и в туторе [10](../ui-performance/), тот факт, что frame-вёрстка быстрее Auto Layout, — авторское утверждение статьи. Практическое правило: сначала измерь, потом переходи на frames, и только там, где Auto Layout действительно узкое место.

## Шаг 2. Вёрстка кодом аккуратно

Стандартный шаблон экрана без storyboard: вёрстка — в отдельной `UIView`, контроллер подменяет свою корневую view в `loadView()`. Так контроллер не засоряется constraints, а view можно тестировать отдельно.

```swift
final class ProfileView: UIView {
    let avatarView = UIImageView()
    let nameLabel = UILabel()
    let followButton = UIButton(configuration: .filled())      // iOS 15+, шаг 7
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
        followButton.configuration?.title = "Подписаться"

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
    override func loadView() { view = profileView }       // своя корневая view
}
```

**Правила (тутор [04](../autolayout-constraints/)):** `translatesAutoresizingMaskIntoConstraints = false` для каждой view, у которой задаёшь свои constraints; все constraints активируй одним вызовом `NSLayoutConstraint.activate`; не оставляй вёрстку «неполной»: у view должны быть и позиция, и размер (либо явно, либо через intrinsic size, тутор [05](../autolayout-layout-pass/)).

## Шаг 3. SnapKit и его ловушки

> **SnapKit** — сторонняя библиотека — синтаксический сахар и обёртки над `NSLayoutConstraint` для более удобной работы с ограничениями. По статье «iOS-разработка со SnapKit» (2023): первый релиз — 2016 год, последний на момент статьи — 5.6.0 (апрель 2022). Текущую версию проверяй в репозитории.

```swift
// SnapKit
button.snp.makeConstraints {
    $0.center.equalToSuperview()
    $0.top.left.greaterThanOrEqualToSuperview()
}

// то же без библиотеки
button.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
    button.centerXAnchor.constraint(equalTo: view.centerXAnchor),
    button.centerYAnchor.constraint(equalTo: view.centerYAnchor),
    button.topAnchor.constraint(greaterThanOrEqualTo: view.topAnchor),
    button.leadingAnchor.constraint(greaterThanOrEqualTo: view.leadingAnchor)
])
```

**Четыре метода управления списком ограничений (по статье):**

- `makeConstraints` — создать и активировать ограничения «с нуля» (выставляет `translatesAutoresizingMaskIntoConstraints = false` сам);
- `remakeConstraints` — сначала деактивировать все старые, потом создать заново;
- `updateConstraints` — обновить уже созданные; если подходящего существующего нет, будет `fatalError`;
- `removeConstraints` — удалить.

Также `equalToSuperview()` падает с `fatalError`, если у view ещё нет superview: сначала `addSubview`, потом constraints. Объединяющие атрибуты (`edges`, `horizontalEdges`, `verticalEdges`, `size`, `center`, `margins`...) сокращают код. Для отладки есть `labeled(_:)`: идентификатор будет виден в логе при конфликте constraints.

**Шесть ловушек (из статьи):**

| Ловушка | В чём проблема | Решение |
| --- | --- | --- |
| 1. Неполный набор ограничений | Только `center` — кнопка с длинным текстом может выйти за superview, ошибок Layout не будет | Ограничить ещё по одному неравенству по каждой оси (`greaterThanOrEqualTo`) |
| 2. `offset` вместо `inset` | `offset` оставляет константу как есть: `right.equalToSuperview().offset(50)` сдвигает правый край наружу. `inset` для правого и нижнего края меняет знак, отступ получается внутрь | Для отступов от краев: `edges.equalToSuperview().inset(50)` |
| 3. Лишние ограничения | «Перестраховка» (все четыре стороны плюс центр) даёт не нужные вычисления, а внутри `UIStackView` — конфликты, когда стек меняет ось | Достаточно набора; в stack view позицию выбирает сам stack |
| 4. `left` и `leading` | Для языков с направлением справа налево `leading` — это правый край | Везде единый стиль; обычно `leading` и `trailing` (тутор [04](../autolayout-constraints/)) |
| 5. Нет взаимосвязи между элементами | Три метки, каждая привязана к superview сама по себе: при длинном тексте они налезают друг на друга без ошибок в консоли | Цепочка: `label2.top == label1.bottom + 16`, `label3.top == label2.bottom + 16` |
| 6. `left` и `leftMargin` | `margin` — это отступы внутри view (`layoutMargins`). `leadingMargin.equalToSuperview()` берёт маржины обеих view и отступ оказывается не тем | Для привязки к margin родителя: `$0.leading.equalTo(view.snp.leadingMargin)` |

```swift
// ловушка 5: цепочка вместо привязок каждого лейбла к superview
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

Полезный вывод статьи: перед каждым constraint спрашивай «а точно оно будет работать правильно?» и «а точно ли оно нужно?». Не всё из перечисленного нужно в каждом проекте (например, RTL).

## Шаг 4. Клавиатура: keyboardLayoutGuide

Классическая проблема: клавиатура перекрывает поле ввода. Раньше её решали подпиской на уведомления `keyboardWillShow` и ручным смещением. С iOS 15 есть `view.keyboardLayoutGuide` — layout guide, который представляет место, занимаемое клавиатурой в твоём layout (`UIKeyboardLayoutGuide`).

**Как работает (по документации Apple):**

- Когда клавиатуры нет на экране, guide лежит внизу окна, а его высота равна нижнему `safeAreaInsets`. Поэтому «привязать к клавиатуре» без клавиатуры даёт обычный отступ от safe area.
- Когда клавиатура появляется (docked), guide совпадает с ней. Используй его как любой другой layout guide.
- По умолчанию `followsUndockedKeyboard = false`: при отсоединённой (undocked) клавиатуре guide ведёт себя как при скрытой. Включать `true` и задавать tracking constraints (`setConstraints(_:activeWhenAwayFrom:)`, `activeWhenNearEdge`) нужно только для floating и split-клавиатур (в основном iPad).
- Constraints, привязанные к anchors guide напрямую, автоматически не включаются и не выключаются — полный tracking дают только методы `setConstraints`.

```swift
// панель ввода внизу экрана: сама поднимается вместе с клавиатурой
inputBar.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
    inputBar.leadingAnchor.constraint(equalTo: view.leadingAnchor),
    inputBar.trailingAnchor.constraint(equalTo: view.trailingAnchor),
    inputBar.bottomAnchor.constraint(equalTo: view.keyboardLayoutGuide.topAnchor)
])

// список над панелью ввода, клавиатура уходит жестом вниз
tableView.bottomAnchor.constraint(equalTo: inputBar.topAnchor).isActive = true
tableView.keyboardDismissMode = .interactive        // тутор 08
```

**До iOS 15 (уведомления).** Теперь реже, для поддержки старых версий. Подписываются на `UIResponder.keyboardWillChangeFrameNotification`, из `userInfo` берут конечный фрейм (`UIResponder.keyboardFrameEndUserInfoKey`) и длительность анимации (`keyboardAnimationDurationUserInfoKey`) и меняют `contentInset` или constraint внутри анимации (туторы [05](../autolayout-layout-pass/) и [08](../lists/); подписку снимать, тутор [09](../data-passing-appearance/)).

## Шаг 5. Анимации

В туторе [02](../calayer-drawing/) мы видели, что изменения свойств слоя анимируются неявно, а view это отключает вне анимационных блоков. На уровне UIKit у тебя три инструмента:

| Инструмент | Когда |
| --- | --- |
| `UIView.animate(withDuration:...)` | Простые анимации «выполнилось и готово»: появление, сдвиг, поворот |
| `UIView.animate(springDuration:bounce:...)` (iOS 17+) | Пружинная анимация с параметрами «длительность и отскок» |
| `UIViewPropertyAnimator` (iOS 10+) | Анимацию нужно приостанавливать, перематывать, разворачивать, вести жестом |
| `CAAnimation` (explicit) | Тонкое управление свойствами слоя (тутор [02](../calayer-drawing/)) |

```swift
// обычная анимация; allowUserInteraction — иначе на время анимации касания отключаются (тутор 06)
UIView.animate(withDuration: 0.3, delay: 0, options: [.curveEaseInOut, .allowUserInteraction]) {
    card.alpha = 1
    card.transform = .identity
} completion: { _ in
    print("готово")
}

// пружинная (iOS 17+)
UIView.animate(springDuration: 0.5, bounce: 0.3) {
    card.center = target
}
```

**`UIViewPropertyAnimator`.** По документации Apple, он позволяет анимировать изменения view и динамически менять анимацию до её окончания. Выбираешь: блок с изменениями, timing curve (встроенная, Безье или spring), длительность, completion. Если создаёшь через обычный init, нужен явный `startAnimation()` (или `runningPropertyAnimator(...)`, который стартует сразу). Можно запускать, паузить, возобновлять, останавливать, добавлять блоки после старта, проматывать через `fractionComplete`, менять направление `isReversed`, доделывать с другой кривой через `continueAnimation(withTimingParameters:durationFactor:)`.

```swift
let animator = UIViewPropertyAnimator(duration: 0.4, dampingRatio: 0.8) {
    self.card.center = self.target
}
animator.addCompletion { position in
    if position == .end { print("дошла до конца") }
}
animator.startAnimation()

// интерактивно (например, по жесту pan)
animator.pauseAnimation()
animator.fractionComplete = progress              // 0...1 — проматываем пальцем
animator.continueAnimation(withTimingParameters: nil, durationFactor: 0)   // доделать
```

**Анимация constraints** — тутор [05](../autolayout-layout-pass/): изменить `constant` до блока, внутри блока вызвать `layoutIfNeeded()` на корневой view.

Нюанс явных анимаций `CAAnimation` (из статьи «Устройство UI в iOS»): анимация меняет `presentationLayer` (копию слоя в текущий момент), а модельные значения свойств остаются прежними; поэтому после окончания анимации слой возвращается к модельным значениям, если не сделать `isRemovedOnCompletion = false`. Для касаний по анимируемому элементу hit-test опирается на модельный frame (тутор [06](../touches-hittest/)).

## Шаг 6. Bottom sheet

**Системный: `UISheetPresentationController` (iOS 15+).** По документации Apple, он позволяет показать view controller как sheet. Размер задаётся **detent**’ами — высотами, на которых sheet может «останавливаться». Настраивается до показа в `sheetPresentationController` контроллера.

```swift
let details = DetailsViewController()
if let sheet = details.sheetPresentationController {
    sheet.detents = [.medium(), .large()]
    sheet.largestUndimmedDetentIdentifier = .medium     // до medium задний план не затемняется и остаётся интерактивным
    sheet.prefersGrabberVisible = true
    sheet.prefersScrollingExpandsWhenScrolledToEdge = false
}
present(details, animated: true)
```

Есть метод `invalidateDetents()` для перерасчёта кастомных detent’ов и `animateChanges(_:)` для анимации изменений свойств sheet.

**Свой bottom sheet — `UIPresentationController` (статья Joom).** Нужен, когда дизайн выходит за рамки системного sheet. Идея: за показ отвечает presentation controller (добавляет view в иерархию, задаёт положение, учитывает размер контента, затемнение), а анимация — в объекте, который реализует `UIViewControllerAnimatedTransitioning`. Интерактивное закрытие делают через `UIPercentDrivenInteractiveTransition` и pan-жест.

- `modalPresentationStyle = .custom` и `transitioningDelegate`; `transitioningDelegate` у view controller — `weak`, поэтому сильную ссылку на делегат нужно держать самому;
- положение задаёт `frameOfPresentedViewInContainerView`; размер контента — через `preferredContentSize` контроллера, изменения — через `preferredContentSizeDidChange(forChildContentContainer:)`; анимацию при изменении размера нужно задать самому;
- если внутри есть scroll view, жесты конфликтуют (тутор [07](../responder-chain-gestures/)): закрытие начинают, только когда `contentOffset` у верха и скролл идёт вниз; у `UIScrollView` уже есть `delegate`, поэтому статья использует прокси «multicast delegate», чтобы не затирать чужой;
- `UINavigationController` внутри sheet не реагирует на уменьшение `preferredContentSize` и не анимирует размер при push и pop, поэтому в статье пишут своего наследника и свой транзишен.

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

// показ
private let sheetDelegate = SheetTransitioningDelegate()       // сильная ссылка
let vc = ContentViewController()
vc.modalPresentationStyle = .custom
vc.transitioningDelegate = sheetDelegate
present(vc, animated: true)
```

## Шаг 7. UIButton.Configuration

По документации Apple, `UIButton.Configuration` (iOS 15+) — это структура, которая задаёт внешний вид и поведение кнопки и её содержимого. Она заменяет методы вроде `setTitle(_:for:)` и может работать вместе с ними.

| Стиль | Что даёт |
| --- | --- |
| `plain()`, `borderless()` | Прозрачный фон или без рамки |
| `gray()`, `tinted()`, `filled()` | Серый, оттенок цвета tint, залитый цветом tint |
| `bordered()`, `borderedTinted()`, `borderedProminent()` | С рамкой, в том числе выделенные |
| `glass()`, `clearGlass()`, `prominentGlass()`, `prominentClearGlass()` | Liquid Glass (iOS 26) |

Настраиваемые свойства: `title`, `subtitle`, `image`, `imagePlacement`, `imagePadding`, `contentInsets`, `baseBackgroundColor`, `baseForegroundColor`, `cornerStyle`, `buttonSize`, `showsActivityIndicator`, `indicator`, `automaticallyUpdateForSelection`.

```swift
var config = UIButton.Configuration.filled()
config.title = "Купить"
config.subtitle = "от 299 ₽"
config.image = UIImage(systemName: "cart")
config.imagePlacement = .leading
config.imagePadding = 8
config.cornerStyle = .capsule
config.baseBackgroundColor = .systemBlue
button.configuration = config

// состояние «загрузка»: индикатор вместо картинки
button.configuration?.showsActivityIndicator = true
```

Связь с тутором [09](../data-passing-appearance/): вместо того чтобы мучиться с `UIAppearance` и `layer.cornerRadius` для кнопок, используй `cornerStyle` и цвета в configuration.

## Шаг 8. Скрытие tab bar

Есть функция `setTabBarHidden`, которая сдвигает `tabBar.frame` вниз на высоту панели в анимации и потом ставит `isHidden`. Рабочее решение для простых случаев, но у него есть ограничения, и для современных версий iOS есть штатный способ.

```swift
// iOS 18+: штатный способ
tabBarController?.setTabBarHidden(true, animated: true)

// скрыть нижнюю панель на экране, который пушится (версии до iOS 18)
let details = DetailsViewController()
details.hidesBottomBarWhenPushed = true
navigationController?.pushViewController(details, animated: true)
```

Свойство `hidesBottomBarWhenPushed` в документации Apple описано как скрытие нижней панели (toolbar) при push в navigation controller; что оно также скрывает tab bar — известная практика, но на этой странице Apple этого прямо не подтверждено.

## Шаг 9. Новое в UIKit

**1. Observation tracking и `updateProperties()`.**

Классически при изменении модели нужно самому помечать view для обновления (`setNeedsLayout`, `setNeedsDisplay`) — разработчик должен помнить, когда и где инвалидировать. Документация Apple: если модель помечена макросом `@Observable`, UIKit сам следит за её свойствами, которые ты читаешь в специальных методах, и обновляет view при их изменении. Такие методы: `updateProperties()` (у view и у view controller) и `layoutSubviews()`; для ячеек — `configurationUpdateHandler`.

- `updateProperties()` — для того, что не влияет на геометрию (текст, цвета, видимость); `layoutSubviews()` — для геометрии. Так избегают лишних проходов layout.
- Вручную запросить обновление: `setNeedsUpdateProperties()`.
- В iOS 18 автоматическое отслеживание **не включено по умолчанию**: нужно добавить в `Info.plist` ключ `UIObservationTrackingEnabled` со значением `true`. Для этого же отслеживания в iOS 18 в view controller берут `viewWillLayoutSubviews()`. Для более новых версий сверься с актуальными нотами Apple.

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
        statusLabel.alpha = model.showStatus ? 1 : 0       // читаем свойства модели — UIKit запомнит зависимость
        statusLabel.text = model.statusText
    }
}
```

**Порядок update pass (Apple):** обновление trait collection, `updateProperties()`, `layoutSubviews()`, отрисовка (display), показ кадра. Если какой-то шаг вызывает обновления других view, процесс повторяется. Это дополняет цикл из тутора [05](../autolayout-layout-pass/): перед layout теперь есть и шаг «свойства». UIKit может пропустить `updateProperties()` или `layoutSubviews()`, если нечего обновлять.

**2. Liquid Glass (iOS 26).** По сессии WWDC25 «Build a UIKit app with the new design»: основа нового дизайна — материал Liquid Glass. Системные компоненты обновлены: `UITabBarController` и `UISplitViewController` получили новый внешний вид, навигационные панели и toolbar’ы «парят» над контентом. Для своих элементов есть `UIGlassEffect` (стили `.regular` и `.clear`) и готовые стили кнопок (шаг 7).

```swift
let button = UIButton()
button.configuration = .glass()                 // iOS 26+
button.configuration?.title = "Glass"

let effectView = UIVisualEffectView(effect: UIGlassEffect(style: .regular))   // iOS 26+
```

**3. Другое из прошлых версий** (уже встречалось в туторах): `keyboardLayoutGuide` (iOS 15), системный sheet и `UIButton.Configuration` (iOS 15), конфигурации ячеек (iOS 14), diffable data source (iOS 13), spring-анимации с `springDuration` (iOS 17).

> **Граница главы.** Что появилось в iOS 27 и в статьях после WWDC26, здесь не разобрано: смотри Apple - «What’s new in UIKit».

## Типичные ошибки

- Переименовать класс экрана и забыть его в Interface Builder: крэш в runtime.
- Вёрстка на frames без измерений: сложный код без реальной выгоды.
- Забыть `translatesAutoresizingMaskIntoConstraints = false` при вёрстке кодом (тутор [04](../autolayout-constraints/)).
- У SnapKit: одно `center` без ограничений по краям; `offset` вместо `inset` для правого и нижнего отступа.
- Привязывать каждую view к superview, а не друг к другу: вёрстка «плывёт» при длинном тексте.
- Путать `left` и `leftMargin`.
- Вызывать `equalToSuperview()` до `addSubview`: `fatalError`.
- Думать, что для `keyboardLayoutGuide` обязательно `followsUndockedKeyboard = true`: для docked-клавиатуры не нужно.
- Полагаться на tracking constraints без `setConstraints(...)`: они не включаются автоматически.
- Анимация без `.allowUserInteraction`, когда нужно реагировать на касания во время анимации.
- `UIViewPropertyAnimator` без `startAnimation()`: ничего не произойдёт.
- Хранить `transitioningDelegate` только как weak без сильной ссылки снаружи: он освободится и показ сломается.
- Писать свой bottom sheet, когда хватит `UISheetPresentationController`.
- Ручная стилизация кнопок через `layer.cornerRadius` и `backgroundColor`, когда есть `UIButton.Configuration`.
- Разрешить observation tracking в iOS 18 без ключа `UIObservationTrackingEnabled`: отслеживание не заработает.
- Класть в `updateProperties()` расчёт геометрии: геометрия — в `layoutSubviews()`.

<details>
<summary>Если на экране только поле ввода и клавиатура, можно ли обойтись без наблюдения за нотификациями?</summary>

Да, с iOS 15: привязать нижний край поля или панели к `view.keyboardLayoutGuide.topAnchor`. Когда клавиатуры нет, guide лежит внизу окна с высотой нижнего safe area inset, а когда клавиатура появилась, он совпадает с ней. Для списков добавляют `keyboardDismissMode = .interactive`.

</details>

## Шпаргалка

```swift
// Вёрстка: Auto Layout кодом; корневая view в loadView(); translatesAutoresizingMaskIntoConstraints = false; NSLayoutConstraint.activate([...])
// SnapKit: makeConstraints / remakeConstraints / updateConstraints / removeConstraints
//   inset для отступов от краев; цепочка между элементами; left против leftMargin

// Клавиатура (iOS 15)
inputBar.bottomAnchor.constraint(equalTo: view.keyboardLayoutGuide.topAnchor)
// followsUndockedKeyboard = true и setConstraints(_:activeWhenAwayFrom:) — только для floating/split

// Анимации
UIView.animate(withDuration: 0.3, delay: 0, options: [.allowUserInteraction]) { ... }
UIView.animate(springDuration: 0.5, bounce: 0.3) { ... }          // iOS 17
let a = UIViewPropertyAnimator(duration: 0.4, dampingRatio: 0.8) { ... }; a.startAnimation()
a.pauseAnimation(); a.fractionComplete = p; a.continueAnimation(withTimingParameters: nil, durationFactor: 0)

// Sheet
sheet.detents = [.medium(), .large()]; sheet.prefersGrabberVisible = true      // iOS 15
// свой: UIPresentationController + UIViewControllerTransitioningDelegate (сильная ссылка на делегат)

// Кнопки
var c = UIButton.Configuration.filled(); c.title = "..."; c.cornerStyle = .capsule; button.configuration = c

// Новое
override func updateProperties() { super.updateProperties(); label.text = model.text }     // @Observable; iOS 18: UIObservationTrackingEnabled
// iOS 26: .glass() у UIButton.Configuration, UIGlassEffect
```

## Вопросы для самопроверки

<details>
<summary>1. Три подхода к вёрстке и их плюсы и минусы?</summary>

Storyboard — быстро и наглядно, но плохо читается на ревью, конфликты слияния, ошибки в runtime. Auto Layout кодом — читаемый и масштабируемый, но вход сложнее. Frame — максимальная производительность, но дорогой и громоздкий код (оценка автора статьи).

</details>

<details>
<summary>2. В чём разница между offset и inset в SnapKit?</summary>

`offset` оставляет константу как есть (знак не меняется). `inset` для правого и нижнего края инвертирует знак, чтобы отступ получился внутрь родителя.

</details>

<details>
<summary>3. Как дать полю ввода не оказаться под клавиатурой? Правда ли, что нужен followsUndockedKeyboard = true?</summary>

Привязать к `view.keyboardLayoutGuide.topAnchor`. `followsUndockedKeyboard` нужен только для слежения за floating и split-клавиатурой и tracking constraints; для обычной docked-клавиатуры не нужен.

</details>

<details>
<summary>4. Чем UIViewPropertyAnimator отличается от UIView.animate?</summary>

Он позволяет управлять анимацией во время выполнения: пауза, возобновление, промотка через `fractionComplete`, разворот `isReversed`, добавление блоков, смена timing. Старт — явный `startAnimation()`.

</details>

<details>
<summary>5. Когда брать системный UISheetPresentationController, а когда свой UIPresentationController?</summary>

Системный — по умолчанию (iOS 15+, detents, grabber, настройки). Свой — когда дизайн не укладывается в его возможности: сам положение, затемнение, анимация и интерактивное закрытие делают через пару presentation controller, transitioning delegate и interactive transition.

</details>

<details>
<summary>6. Что такое UIButton.Configuration и зачем оно?</summary>

Структура (iOS 15+), которая задаёт вид и поведение кнопки: стиль (`filled`, `tinted`, `gray`...), title, subtitle, image, отступы, углы, индикатор загрузки. Заменяет ручную настройку через `setTitle` и `layer`.

</details>

<details>
<summary>7. Что такое observation tracking в UIKit и что такое updateProperties()?</summary>

UIKit автоматически следит за свойствами `@Observable`-модели, которые читаются в `updateProperties()`, `layoutSubviews()` и handler’ах ячеек, и перезапускает их при изменении. `updateProperties()` — для настройки содержимого и стилей, запускается перед layout. В iOS 18 включается ключом `UIObservationTrackingEnabled`.

</details>

## Источники

- [UIKeyboardLayoutGuide — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uikeyboardlayoutguide)
- [Adjusting your layout with keyboard layout guide — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/adjusting-your-layout-with-keyboard-layout-guide)
- [UIViewPropertyAnimator — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uiviewpropertyanimator)
- [UIView animate with springDuration — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uiview/animate(springduration:bounce:initialspringvelocity:delay:options:animations:completion:))
- [UISheetPresentationController — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uisheetpresentationcontroller)
- [UIButton.Configuration — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uibutton/configuration-swift.struct)
- [Updating views automatically with observation tracking in UIKit — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/updating-views-automatically-with-observation-tracking-in-uikit)
- [Build a UIKit app with the new design — WWDC25 (Apple)](https://developer.apple.com/videos/play/wwdc2025/284/)
- [What’s New in UIKit iOS 26 — sebvidal.com](https://sebvidal.com/blog/whats-new-in-uikit-26/)
- [Подходы к верстке в UIKit — AppTractor](https://apptractor.ru/info/articles/podhody-k-verstke-v-uikit.html)
- [Используем новый keyboardLayoutGuide — AppTractor](https://apptractor.ru/info/articles/ispolzuem-novyy-keyboardlayoutguide-chtoby-spastis-ot-klaviatury.html)
- [iOS-разработка со SnapKit — Habr](https://habr.com/ru/companies/sravni/articles/719474/)
- [Bottom Sheet, перейдём на «ты» — Habr](https://habr.com/ru/companies/joom/articles/596821/)
- [Устройство UI в iOS — sidorov.tech](https://sidorov.tech/all/ustroystvo-ui-v-ios/)
- [Вёрстка кодом с помощью SnapKit на Swift — YouTube](https://youtu.be/wTL7Ju4-3Kg?si=R4rBJI6copFho8Gp)
- [Building a UIKit user interface programmatically — Hacking with Swift](https://www.hackingwithswift.com/read/8/2/building-a-uikit-user-interface-programmatically)
- [WTF Auto Layout](https://www.wtfautolayout.com/?example=true)
- [Find A Problematic View In The View Debugger — dasdom.dev](https://dasdom.dev/find-a-view-in-view-debugger/)
- [Corner Radius, Shadows, Borders — Advanced Swift](https://www.advancedswift.com/corners-borders-shadows/)
- [NSAttributedString: Formatting Rich Text in Swift — swiftyplace](https://www.swiftyplace.com/blog/nsattributedstring-swift)
- [Как реализовать таб-бар с нестандартной кнопкой: CAShapeLayer и UIResponderChain — Habr](https://habr.com/ru/companies/simbirsoft/articles/550994/)
- [Всплывай! Транзишены в iOS — Habr](https://habr.com/ru/companies/dododev/articles/463527/)
- [Bottom sheet: Custom transitioning — Habr](https://habr.com/ru/companies/koshelek/articles/697962/)
- [iOS 18 для разработчиков: ключевые изменения в UIKit — Habr](https://habr.com/ru/companies/kts/articles/852764/)
- [Automatic Observation Tracking in UIKit and AppKit — Peter Steinberger](https://steipete.me/posts/2025/automatic-observation-tracking-uikit-appkit)
- [Как заставить крутиться таймер — Habr](https://habr.com/ru/companies/ecom_tech/articles/867660/)
- [Кнопки красить — это вам не деревья вертеть, Евгений Ёлчев — YouTube](https://www.youtube.com/watch?v=4Twa-pnuON0)
- [Мастер-класс по созданию анимаций в iOS — Mad Brains Техно, YouTube](https://www.youtube.com/watch?v=zrFqpRelI9I&list=PLw6SJ6q6-1YowmlGVks5a088XrSbihJu-&index=42)
- [Поворот экрана в iOS, Fullscreen in iOS — Mad Brains Техно, YouTube](https://www.youtube.com/watch?v=FiJwdnYHoVY&list=PLw6SJ6q6-1YowmlGVks5a088XrSbihJu-&index=30)
- [Как работать в фоне в iOS — Mad Brains Техно, YouTube](https://www.youtube.com/watch?v=6M9XzvDpKHI&list=PLw6SJ6q6-1YowmlGVks5a088XrSbihJu-&index=38)
