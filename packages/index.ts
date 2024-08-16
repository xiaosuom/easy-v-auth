import type { UserConfig } from './types';
export * from './auth';

export function defineConfig(config: UserConfig) {
	return config;
}
