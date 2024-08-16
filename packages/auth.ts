import { Directive } from 'vue';
const path = require('path');
const fs = require('fs');
const configPath = path.resolve(process.cwd(), 'auth.config.ts');

const vAuth: Directive = {
	mounted(el) {
		console.log(123);
		el.focus();
	},
};

export default vAuth;
