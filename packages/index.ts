import { App, DirectiveBinding, watchEffect } from 'vue';

export interface AuthConfig {
	getRoles?: () => string[] | string | undefined;
	getPermissions?: () => string[] | string | undefined;
	defaultArg?: 'role' | 'permission';
}

export const createAuth = (config: AuthConfig = {}) => {
	let display = '';
	return {
		install(app: App) {
			app.directive('auth', {
				created(el: HTMLElement) {
					el.style.visibility = 'hidden';
				},
				beforeMount(el: HTMLElement) {
					display = el.style.display;
				},
				mounted(el: HTMLElement, binding: DirectiveBinding) {
					// 校验权限
					function checkAuth() {
						// 用户的角色或权限
						let auth: string | string[] | undefined;
						let { getRoles, getPermissions, defaultArg } = config;
						defaultArg = defaultArg ?? 'role'; // 默认使用角色

						// 指令传入的信息
						let { arg = defaultArg, value } = binding;
						value = [].concat(value);

						if (arg === 'role' && getRoles) {
							auth = getRoles();
						} else if (arg === 'permission' && getPermissions) {
							auth = getPermissions();
						}

						if (auth) {
							if (typeof auth === 'string') {
								auth = [auth];
							}
							for (const item of auth) {
								if (value.includes(item)) {
									el.style.visibility = 'visible';
									el.style.display = display;
									return;
								}
							}
							removeEl(el);
						} else {
							// 没有 auth - 只隐藏、不移除
							el.style.display = 'none';
						}
					}

					// 初始化检查
					checkAuth();

					// 使用 watchEffect 监听权限变化
					watchEffect(() => {
						checkAuth();
					});
				},
			});
		},
	};
};

// 移除元素
const removeEl = (el: HTMLElement) => el.parentNode && el.parentNode.removeChild(el);
