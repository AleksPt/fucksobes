---
title: "What is image downsampling? Why is it needed?"
category: uikit
order: 142
---

When displayed, an image takes up in memory not the file size but the decompressed bitmap: width × height × 4 bytes (RGBA). A 4000×3000 pixel photo is about 48 MB, even if the JPEG file weighs 2 MB. If you show it in a 100×100 pt `UIImageView`, that memory is wasted.

Downsampling means loading a reduced copy at the required size right away, without creating the full-size bitmap. It is done through ImageIO:

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

There is also `UIImage.preparingThumbnail(of:)`. This reduces memory consumption and decoding time, which matters for feeds and collections. The heavy preparation is done on a background thread.
