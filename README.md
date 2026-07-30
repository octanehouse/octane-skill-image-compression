# Octane Image Compression

A small black/red/white image compression workbench for the Octane resource
library. It runs locally in the browser: choose an image, tune width/quality/
format, preview the result, and download it without uploading the source.

Live resource: <https://marcusmfrancis.com/skills/image-compression>

## Use it

```bash
npx --yes github:octanehouse/octane-skills-cli add-source octanehouse/octane-skill-image-compression --skill octane-image-compression --dest .octane/skills
```

```tsx
import { ImageCompressionWorkbench } from "@octane-house/image-compression";

<ImageCompressionWorkbench />;
```

The reusable `compressImage` helper uses the browser Canvas API and returns a
Blob plus dimensions and format metadata. Sharp remains the source-backed
server-side reference for projects that need authenticated batch processing.

## License

The Octane wrapper is MIT. See `SKILL.md` for the integration and safety
boundary.
