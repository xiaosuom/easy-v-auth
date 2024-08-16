import { defineStore } from 'pinia';

export  const useStore = defineStore('user', {
	state: () => {
		return {
			// 用于尚未加载的数据
			user: null as UserInfo | null,
		};
	},
});

interface UserInfo {
	role?: string;
	permission?: string[];
}
