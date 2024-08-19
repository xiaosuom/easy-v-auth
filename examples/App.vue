<template>
	<h1>测试</h1>
	<button v-auth="['staff', 'user']">员工、用户可用</button>
	<button v-auth="'admin'">管理员可用</button>
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
	setTimeout(() => {
		store.user = {
			role: 'staff',
			permission: ['user::read', 'user::write'],
		};
	}, 1000);
});
</script>
