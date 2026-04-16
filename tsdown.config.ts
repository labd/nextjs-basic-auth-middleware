import { defineConfig } from "tsdown/config";

export default defineConfig({
	entry: ["src/index.ts"],
	clean: true,
	dts: true,
	shims: true,
	hash: false,
	sourcemap: true,
	format: ["esm", "cjs"],
	outDir: "dist",
});
