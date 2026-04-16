import { type NextRequest, NextResponse } from "next/server";
import { basicAuthentication } from "./lib/auth.ts";
import {
	type AuthCredentials,
	compareCredentials,
	parseCredentials,
} from "./lib/credentials.ts";
import type { MiddlewareOptions } from "./types.js";

/**
 * Creates a default Next middleware function that returns `NextResponse.next()` if the basic auth passes
 * @param req Next middleware request
 * @param options Options object based on MiddlewareOptions
 * @returns Either a 401 error or goes to the next page
 */
export const createNextAuthMiddleware =
	({
		users = [],
		message = "Authentication failed",
		realm = "protected",
	}: MiddlewareOptions = {}) =>
	(req: NextRequest) =>
		nextBasicAuthMiddleware({ users, message, realm }, req);

export const nextBasicAuthMiddleware = (
	{
		users = [],
		message = "Authentication failed",
		realm = "protected",
	}: MiddlewareOptions = {},
	req: NextRequest,
) => {
	// Check if credentials are set up
	const environmentCredentials = process.env.BASIC_AUTH_CREDENTIALS || "";
	if (environmentCredentials.length === 0 && users.length === 0) {
		// No credentials set up, continue rendering the page as normal
		return NextResponse.next();
	}

	const credentialsObject: AuthCredentials =
		environmentCredentials.length > 0
			? parseCredentials(environmentCredentials)
			: users;

	const authHeader = req.headers.get("authorization");

	if (authHeader) {
		try {
			const currentUser = basicAuthentication(authHeader);

			if (currentUser && compareCredentials(currentUser, credentialsObject)) {
				return NextResponse.next();
			}
		} catch {
			// Malformed authorization header — fall through to 401
		}
	}

	return new NextResponse(message, {
		status: 401,
		headers: { "WWW-Authenticate": `Basic realm="${realm}"` },
	});
};
