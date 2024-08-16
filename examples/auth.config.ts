import { defineConfig } from '../packages';

export default defineConfig({
	user: {
		roles: () => 'test',
		permissions: () => ['user_read', 'user_write'],
	},
});
