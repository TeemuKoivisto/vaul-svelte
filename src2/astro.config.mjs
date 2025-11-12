import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	integrations: [svelte(), tailwind()],
	vite: {
		resolve: {
			alias: {
				$lib: path.resolve(__dirname, "../src/lib"),
			},
		},
		server: {
			fs: {
				allow: [".."],
			},
		},
	},
});
