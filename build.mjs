import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  format: "esm",
  platform: "browser",
  outdir: "dist",
  entryNames: "index",
  external: ["react", "react-dom"],
});
