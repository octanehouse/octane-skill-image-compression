---
name: Octane Image Compression
description: Resize, convert, and compress image assets with Sharp before they reach the web or social preview.
category: Visual
source: https://github.com/lovell/sharp
license: Apache-2.0
---

# Octane Image Compression

Use this skill for OG images, thumbnails, hero screenshots, and uploaded media. Keep the original when it is an input artifact, but publish an explicit compressed derivative.

## Installation

```bash
npm i sharp
```

## Integration

Choose dimensions from the consuming surface, strip unnecessary metadata, and prefer WebP or AVIF for web delivery. Keep JPEG for broad social-preview compatibility when required.

```ts
import sharp from "sharp";

await sharp(input)
  .resize({ width: 1200, height: 630, fit: "cover" })
  .jpeg({ quality: 86, progressive: true, mozjpeg: true })
  .toFile(output);
```

Do not overwrite the source file implicitly, and verify the output dimensions and content type before publishing it.
