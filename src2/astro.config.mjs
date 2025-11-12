import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	integrations: [svelte(), react()],
	vite: {
		plugins: [tailwindcss()],
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
