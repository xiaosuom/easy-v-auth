import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [vue()],
	build: {
		outDir: 'dist',
		lib: {
			entry: resolve(__dirname, 'packages/index.ts'),
			name: 'easy-upload-vue',
			fileName: (format) => `easy-upload-vue.${format}.js`,
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
