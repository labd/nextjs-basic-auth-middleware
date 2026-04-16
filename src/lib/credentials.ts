import type { BasicAuthResult } from "./auth.ts";
import { safeCompare } from "./compare.ts";

// This contains all the logic for parsing and checking credentials
type AuthCredentialsObject = {
	name: string;
	password: string;
};

export type AuthCredentials = AuthCredentialsObject[];

export const parseCredentials = (credentials: string): AuthCredentials => {
	const authCredentials: AuthCredentials = [];

	credentials.split("|").forEach((item) => {
		const index = item.indexOf(":");
		if (index < 1 || index === item.length - 1) {
			throw new Error(
				`Received incorrect basic auth syntax, use <username>:<password>, received ${item}`,
			);
		}

		authCredentials.push({
			name: item.substring(0, index),
			password: item.substring(index + 1),
		});
	});

	return authCredentials;
};

/**
 * Compares the basic auth credentials with the configured user and password
 * @param credentials Basic Auth credentials object from `basic-auth`
 */
export const compareCredentials = (
	input: BasicAuthResult,
	requiredCredentials: AuthCredentials,
): boolean =>
	requiredCredentials.some((item) => {
		const userMatch = safeCompare(input.user, item.name);
		const passMatch = safeCompare(input.pass, item.password);
		return userMatch && passMatch;
	});
