---
name: octane-image-compression
description: Compress and resize image assets locally in the browser with a no-upload Octane workbench, deterministic format controls, and a reusable Canvas helper.
category: Visual
source: https://github.com/octanehouse/octane-skill-image-compression
upstream: https://github.com/lovell/sharp
license: MIT
---

# Octane Image Compression

Use this skill for thumbnails, social share cards, hero screenshots, and other
image assets that should be resized before shipping.

## Integration

```tsx
import { ImageCompressionWorkbench } from "@octane-house/image-compression";

<ImageCompressionWorkbench />;
```

The browser workbench accepts PNG, JPEG, WebP, and AVIF input, resizes to a
bounded width, exports WebP/JPEG/PNG, and never uploads the source file. For a
server-side pipeline, use Sharp as the attributed upstream reference and add
your own authenticated processing boundary.

## Safety

Keep the browser-only helper local to the client. Do not accept arbitrary remote
URLs or send private images to a server without explicit authorization.
