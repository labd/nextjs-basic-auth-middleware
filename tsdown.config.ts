import { defineConfig } from "tsdown/config";

export default defineConfig({
	entry: ["src/index.ts"],
	clean: true,
	dts: true,
	hash: false,
	sourcemap: true,
	format: ["esm"],
	fixedExtension: false,
	outDir: "dist",
});
