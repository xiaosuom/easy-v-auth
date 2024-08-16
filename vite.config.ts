import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [vue(), dts()],
	build: {
		outDir: 'dist',
		lib: {
			entry: resolve(__dirname, 'packages/index.ts'),
			name: 'easy-v-auth',
			fileName: (format) => `easy-v-auth.${format}.js`,
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
});
