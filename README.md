# Easy v-auth

Vue 3 自定义指令 `v-auth`，实现按钮级权限控制。

特点：在异步获取用户权限信息后，响应式更新控制结果。

## 背景

假如我们将用户权限信息存在状态管理（如 Pinia）中，当用户刷新页面时，就需要重新请求用户信息。
这是一个异步操作，在获得用户信息之前，自定义指令中的 `mounted` 钩子就已经执行了。
因此，`v-auth` 需要响应式的更新控制结果：在用户权限信息变化后，再次校验权限。

多数 `v-auth` 的实现方案不具备上述能力，故笔者制作本工具。

## 使用

一个常见的权限控制模型叫角色-权限模型，即一个用户有若干个角色 `role`，一个角色有若干权限 `permission`。
也可以根据项目需要，只使用角色或权限。

### 注册指令

安装该包后，在 `main.ts` 中注册指令，并传入用户权限信息。
下面例子展示将用户信息存在 Pinia 的情况。
但不管用户信息存在哪里，都可以通过 `getRoles` 和 `getPermissions` 以**函数的形式**传入用户的角色组和权限组。

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
  defaultArg: 'permission', // 默认的指令参数，可选 'role' | 'permission'，默认 'role'
});

// 注册 v-auth 指令
app.use(auth).mount('#app');
```

如例子所示，`createAuth` 函数的参数接受 3 个属性：

- `getRoles`：告诉包如何获取用户的角色。传入一个函数，返回**数组**或**字符串**；
- `getPermissions`：告诉包如何获取用户的权限，同上；
- `defaultArg`：指令默认的参数。你可以用 `v-auth:role` 和 `v-auth:permission` 来分别控制**角色**和**权限**。但是如果你的项目只用了**权限**来控制用户行为，没有用角色，那么你可以设置 `defaultArg: permission`，那样你就可以直接用 `v-auth`，而无需用 `v-auth:permission`。

### 使用指令

该指令可接受参数 `role` 和 `permission`，即你可以用 `v-auth:role` 和 `v-auth:permission` 来分别控制角色和权限。

默认情况下，用户只要满足权限要求中的一项就算验证通过。例如具有权限 `user::read` 的用户，可以通过 `v-auth:permission="['user::read', 'user::write']"`。
但有时候，我们希望用户需要通过所有权限要求才能验证通过。
也就是用户需要同时拥有 `user::read` 和 `user::write` 才能通过。
这时可以通过修饰符 `.and` 来告诉 `v-auth`：`v-auth:permission.and="['user::read', 'user::write']"`。

```vue
<template>
  <h1>测试</h1>
  <button v-auth="['staff', 'user']">员工、用户可用</button>
  <button v-auth:role="'admin'">管理员可用</button>
	<button v-auth:permission="['user::read']">有读权限</button>
	<button v-auth:permission.and="['user::read', 'user::write']">有读、写权限</button>
	<button v-auth:permission="['user::delete']">有删权限</button>
	<button v-auth:permission.and="['user::read', 'user::write', 'user::delete']">有读、写、删权限</button>
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

在上面的例子中，在获得用户权限之前，所有按钮都不可见；在获得之后，【员工、用户可用】、【有读权限】和【有读、写权限】显示，其他按钮被移除。