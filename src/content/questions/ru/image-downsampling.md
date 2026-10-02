---
title: "Что такое image downsampling? Зачем он нужен?"
category: uikit
order: 142
---

Изображение при показе занимает в памяти не размер файла, а разжатый bitmap: ширина × высота × 4 байта (RGBA). Фото 4000×3000 пикселей — около 48 МБ, даже если файл в JPEG весит 2 МБ. Если показывать его в `UIImageView` размером 100×100 pt, память тратится зря.

Downsampling — загрузка уменьшенной копии сразу до нужного размера, без создания полноразмерного bitmap. Делается через ImageIO:

```swift
func downsample(_ url: URL, to size: CGSize, scale: CGFloat) -> UIImage? {
    let src = CGImageSourceCreateWithURL(url as CFURL, [kCGImageSourceShouldCache: false] as CFDictionary)!
    let maxPixel = max(size.width, size.height) * scale
    let options: [CFString: Any] = [
        kCGImageSourceCreateThumbnailFromImageAlways: true,
        kCGImageSourceShouldCacheImmediately: true,
        kCGImageSourceCreateThumbnailWithTransform: true,
        kCGImageSourceThumbnailMaxPixelSize: maxPixel
    ]
    return CGImageSourceCreateThumbnailAtIndex(src, 0, options as CFDictionary).map(UIImage.init)
}
```

Есть и `UIImage.preparingThumbnail(of:)`. Это снижает потребление памяти и время декодирования, что важно для лент и коллекций. Тяжёлую подготовку выполняют в фоновом потоке.
