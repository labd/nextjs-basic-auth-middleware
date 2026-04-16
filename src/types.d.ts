import { AuthCredentials } from "./lib/credentials";

export type MiddlewareOptions = {
	users?: AuthCredentials;
	message?: string;
	realm?: string;
};
