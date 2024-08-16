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
	setTimeout(() => {
		store.user = {
			role: 'staff',
			permission: ['user::read', 'user::write'],
		};
	}, 1000);
});
</script>
