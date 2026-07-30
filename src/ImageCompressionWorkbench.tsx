"use client";

import { useEffect, useRef, useState } from "react";
import { compressImage, type CompressionFormat, type CompressionResult } from "./compressImage";
import "./styles.css";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageCompressionWorkbench() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [maxWidth, setMaxWidth] = useState(1200);
  const [quality, setQuality] = useState(82);
  const [format, setFormat] = useState<CompressionFormat>("webp");
  const [busy, setBusy] = useState(false);
  const sourceUrlRef = useRef("");
  const resultUrlRef = useRef("");

  useEffect(() => () => {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
  }, []);

  function selectFile(nextFile: File | undefined) {
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

  return (
    <section className="octane-compression-workbench" aria-label="Octane image compression workbench">
      <header><div><span>Local-only media utility</span><p>Resize and export a thumbnail in your browser. Nothing is uploaded.</p></div><b>No upload</b></header>
      <label className="octane-compression-dropzone"><strong>{file ? file.name : "Choose an image"}</strong><small>{file ? formatBytes(file.size) : "PNG, JPEG, WebP, or AVIF"}</small><input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => selectFile(event.target.files?.[0])} /></label>
      <div className="octane-compression-controls">
        <label>Max width<input type="number" min={240} max={2400} step={10} value={maxWidth} onChange={(event) => setMaxWidth(Number(event.target.value) || 1200)} /></label>
        <label>Quality · {quality}<input type="range" min={40} max={100} value={quality} onChange={(event) => setQuality(Number(event.target.value))} /></label>
        <label>Format<select value={format} onChange={(event) => setFormat(event.target.value as CompressionFormat)}><option value="webp">WebP</option><option value="jpeg">JPEG</option><option value="png">PNG</option></select></label>
      </div>
      <div className="octane-compression-actions"><button type="button" disabled={!file || busy} onClick={compress}>{busy ? "Compressing…" : "Compress locally"}</button>{file && <small>Original · {formatBytes(file.size)}</small>}{result && <small>Output · {formatBytes(result.blob.size)}</small>}</div>
      {result && resultUrl && <div className="octane-compression-result"><img src={resultUrl} alt="Compressed output preview" /><div><span>Ready to ship</span><p>{result.width} × {result.height} · {result.format.toUpperCase()}</p><p>{Math.max(0, Math.round((1 - result.blob.size / (file?.size || result.blob.size)) * 100))}% smaller than the original</p><a href={resultUrl} download={`octane-compressed.${result.format}`}>Download output</a></div></div>}
      {sourceUrl ? <span className="octane-compression-note">Processing stays in this browser tab.</span> : null}
    </section>
  );
}
