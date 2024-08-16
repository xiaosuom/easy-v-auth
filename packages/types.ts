type Keys = string | string[] | (() => string | string[]);

export interface UserConfig {
	user: {
		roles: Keys;
		permissions: Keys;
	};
}
