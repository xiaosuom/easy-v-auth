import { createApp } from 'vue';
import App from './App.vue';
import { createAuth } from 'easy-v-auth';
import { createPinia } from 'pinia';
import { useStore } from './state';

const pinia = createPinia();

const app = createApp(App).use(pinia);

const store = useStore();
const auth = createAuth({
	getRoles: () => store.user?.role,
	getPermissions: () => store.user?.permission,
});

app.use(auth).mount('#app');
