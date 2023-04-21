import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { sessionCookie } from "~/cookies.server.js";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: sessionCookie,
  });

export { getSession, commitSession, destroySession };

export async function requireUserSession(request) {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);

  if (!session.has("userId")) {
    throw redirect("/login");
  }

  return session;
}
