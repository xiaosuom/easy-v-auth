import { App, DirectiveBinding, watchEffect } from 'vue';

export interface AuthConfig {
	getRoles?: () => string[] | string | null | undefined;
	getPermissions?: () => string[] | string | null | undefined;
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
						let auth: string | string[] | null | undefined;
						let { getRoles, getPermissions, defaultArg } = config;
						defaultArg = defaultArg ?? 'role'; // 默认使用角色

						// 指令传入的信息
						let { arg = defaultArg, value, modifiers } = binding;
						// and=true 表示需要全部符合
						const { and = false } = modifiers;

						value = [].concat(value);

						if (arg === 'role' && getRoles) {
							auth = getRoles();
						} else if (arg === 'permission' && getPermissions) {
							auth = getPermissions();
						}
						console.log('权限', auth);
						if (auth) {
							if (typeof auth === 'string') {
								auth = [auth];
							}
							if ((and && passEvery(value, auth)) || (!and && passSome(value, auth))) {
								el.style.visibility = 'visible';
								el.style.display = display;
								return;
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

// 判断是否全部满足 - value 全部在 auth 中
const passEvery = (subset: string[], superset: string[]) => subset.every((item) => superset.includes(item));

// 判断是否有一个满足 - value 中有一个在 auth 中
const passSome = (subset: string[], superset: string[]) => subset.some((item) => superset.includes(item));
