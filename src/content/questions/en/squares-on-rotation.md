---
title: "What do you do so that squares stay squares when the screen rotates?"
category: uikit
order: 17
---

You need to set an **aspect ratio (Aspect Ratio)** through Auto Layout.

- Select the square in the storyboard.
- Set its **Aspect Ratio**: in the Auto Layout menu click "Add Constraints" and set the aspect ratio (for example, `1:1`).
- Add further constraints for position: pin the square to the center or the edges of the screen (for example, Center X and Center Y) or set distances from the sides of the superview.
- If the square's size should depend on the screen, use **Proportional Constraints**: the size depends on the width or height of the parent element.

*Example.* Tie the square's width to the superview's width with a multiplier (for example, `0.3`), and tie the height to the square's width.

Make sure Auto Layout is enabled and correctly configured for all device orientations.
