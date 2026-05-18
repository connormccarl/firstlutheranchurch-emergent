import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    server: "src/server.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "next", "mongodb"],
  splitting: false,
  treeshake: true,
  loader: { ".css": "copy" },
  onSuccess: "cp src/styles.css dist/styles.css 2>/dev/null || true",
});
