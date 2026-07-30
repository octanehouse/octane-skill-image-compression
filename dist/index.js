// src/compressImage.ts
async function compressImage(file, options = {}) {
  const format = options.format || "webp";
  const maxWidth = Math.min(Math.max(options.maxWidth || 1200, 240), 2400);
  const quality = Math.min(Math.max(options.quality || 82, 40), 100) / 100;
  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = sourceUrl;
    await image.decode();
    const width = Math.min(image.naturalWidth, maxWidth);
    const height = Math.round(image.naturalHeight / image.naturalWidth * width);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable in this browser");
    context.drawImage(image, 0, 0, width, height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, `image/${format}`, format === "png" ? void 0 : quality));
    if (!blob) throw new Error("The browser could not encode this image");
    return { blob, width, height, format };
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

// src/ImageCompressionWorkbench.tsx
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
function ImageCompressionWorkbench() {
  const [file, setFile] = useState(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [result, setResult] = useState(null);
  const [maxWidth, setMaxWidth] = useState(1200);
  const [quality, setQuality] = useState(82);
  const [format, setFormat] = useState("webp");
  const [busy, setBusy] = useState(false);
  const sourceUrlRef = useRef("");
  const resultUrlRef = useRef("");
  useEffect(() => () => {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
  }, []);
  function selectFile(nextFile) {
    if (!nextFile || !nextFile.type.startsWith("image/")) return;
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    const nextUrl = URL.createObjectURL(nextFile);
    sourceUrlRef.current = nextUrl;
    resultUrlRef.current = "";
    setFile(nextFile);
    setSourceUrl(nextUrl);
    setResultUrl("");
    setResult(null);
  }
  async function compress() {
    if (!file) return;
    setBusy(true);
    try {
      const next = await compressImage(file, { maxWidth, quality, format });
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      const nextUrl = URL.createObjectURL(next.blob);
      resultUrlRef.current = nextUrl;
      setResultUrl(nextUrl);
      setResult(next);
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxs("section", { className: "octane-compression-workbench", "aria-label": "Octane image compression workbench", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { children: "Local-only media utility" }),
        /* @__PURE__ */ jsx("p", { children: "Resize and export a thumbnail in your browser. Nothing is uploaded." })
      ] }),
      /* @__PURE__ */ jsx("b", { children: "No upload" })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "octane-compression-dropzone", children: [
      /* @__PURE__ */ jsx("strong", { children: file ? file.name : "Choose an image" }),
      /* @__PURE__ */ jsx("small", { children: file ? formatBytes(file.size) : "PNG, JPEG, WebP, or AVIF" }),
      /* @__PURE__ */ jsx("input", { type: "file", accept: "image/png,image/jpeg,image/webp,image/avif", onChange: (event) => selectFile(event.target.files?.[0]) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "octane-compression-controls", children: [
      /* @__PURE__ */ jsxs("label", { children: [
        "Max width",
        /* @__PURE__ */ jsx("input", { type: "number", min: 240, max: 2400, step: 10, value: maxWidth, onChange: (event) => setMaxWidth(Number(event.target.value) || 1200) })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Quality \xB7 ",
        quality,
        /* @__PURE__ */ jsx("input", { type: "range", min: 40, max: 100, value: quality, onChange: (event) => setQuality(Number(event.target.value)) })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Format",
        /* @__PURE__ */ jsxs("select", { value: format, onChange: (event) => setFormat(event.target.value), children: [
          /* @__PURE__ */ jsx("option", { value: "webp", children: "WebP" }),
          /* @__PURE__ */ jsx("option", { value: "jpeg", children: "JPEG" }),
          /* @__PURE__ */ jsx("option", { value: "png", children: "PNG" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "octane-compression-actions", children: [
      /* @__PURE__ */ jsx("button", { type: "button", disabled: !file || busy, onClick: compress, children: busy ? "Compressing\u2026" : "Compress locally" }),
      file && /* @__PURE__ */ jsxs("small", { children: [
        "Original \xB7 ",
        formatBytes(file.size)
      ] }),
      result && /* @__PURE__ */ jsxs("small", { children: [
        "Output \xB7 ",
        formatBytes(result.blob.size)
      ] })
    ] }),
    result && resultUrl && /* @__PURE__ */ jsxs("div", { className: "octane-compression-result", children: [
      /* @__PURE__ */ jsx("img", { src: resultUrl, alt: "Compressed output preview" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { children: "Ready to ship" }),
        /* @__PURE__ */ jsxs("p", { children: [
          result.width,
          " \xD7 ",
          result.height,
          " \xB7 ",
          result.format.toUpperCase()
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          Math.max(0, Math.round((1 - result.blob.size / (file?.size || result.blob.size)) * 100)),
          "% smaller than the original"
        ] }),
        /* @__PURE__ */ jsx("a", { href: resultUrl, download: `octane-compressed.${result.format}`, children: "Download output" })
      ] })
    ] }),
    sourceUrl ? /* @__PURE__ */ jsx("span", { className: "octane-compression-note", children: "Processing stays in this browser tab." }) : null
  ] });
}
export {
  ImageCompressionWorkbench,
  compressImage
};
