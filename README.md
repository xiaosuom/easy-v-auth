# Easy v-auth

Vue 3 自定义指令 `v-auth`，实现按钮级权限控制。

特点：在异步获取用户权限后，响应式更新控制结果。

## 背景

假如我们将用户权限信息存在状态管理（如 Pinia）中，当用户刷新页面时，就需要重新请求用户信息。
这是一个异步操作，在获得用户信息之前，自定义指令中的 `mounted` 钩子就已经执行了。
因此，`v-auth` 需要响应式的更新控制结果，在用户权限信息变化后，再次校验权限。

## 示例

### 注册指令

在 `main.ts` 中注册指令，并传入用户权限信息。
下面例子展示将用户信息存在 Pinia 的情况。
但不管用户信息存在哪里，都可以通过 `getRoles` 和 `getPermissions` 以函数的形式传入。

```js
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

import { createPinia } from 'pinia';
import { useStore } from './state';

import { createAuth } from 'easy-v-auth';

// 挂载 Pinia
const pinia = createPinia();
const app = createApp(App).use(pinia);

// 注意：使用 Pinia 之前，需要先挂载 Pinia，因此这段代码需要放在 .use(pinia) 之后
const store = useStore();

// 假设用户权限存在 Pinia 中，这里就传入 store
const auth = createAuth({
	getRoles: () => store.user?.role, // 角色信息
	getPermissions: () => store.user?.permission, // 权限信息
    defaultArg: 'permission', // 默认的指令参数，可选 'role' | 'permission'
});

// 注册 v-auth 指令
app.use(auth).mount('#app');
```

### 使用指令

一个常见的权限控制模型叫角色-权限模型，即一个用户有若干个角色，一个角色有若干权限。

```vue
<template>
	<h1>测试</h1>
	<button v-auth="['staff']">员工可用</button>
	<button v-auth="['admin']">管理员可用</button>
	<button v-auth:permission="['user::read']">有读取权限</button>
	<button v-auth:permission="['user::delete']">有删除权限</button>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from './state';
const store = useStore();

onMounted(() => {
    // 模拟异步获取用户权限信息
	setTimeout(() => {
		store.user = {
			role: 'staff',
			permission: ['user::read', 'user::write'],
		};
	}, 1000);
});
</script>
```

在上面的例子中，在获得用户权限之前，所有按钮都不可见；在获得之后，【员工可用】和【有读取权限】，其他按钮被移除。