import { json } from "@remix-run/node";
import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink,
  useCatch,
  useLoaderData,
  Form,
} from "@remix-run/react";
import styles from "~/tailwind.css";
import { getSession } from "./sessions.server";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "tLitter",
    viewport: "width=device-width,initial-scale=1",
  };
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const cookie = request.headers.get("Cookie");
  const username = session.get("username");

  return json({
    isAuthenticated: session.has("userId"),
    username,
  });
}

export default function App() {
  const { isAuthenticated, username } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>

      <body className="bg-white font-sans text-gray-600">
        <header className="flex flex-row items-center gap-3 border-b p-5">
          <Link
            to="/"
            className="mr-auto block transition-colors hover:text-gray-400"
          ></Link>
          {isAuthenticated && (
            <MenuLink to={`/user/${username}`}>{username}</MenuLink>
          )}
          {isAuthenticated && (
            <MenuLink to={`/user/${username}/new`}>Create post</MenuLink>
          )}
          {isAuthenticated ? (
            <>
              <MenuLink to="/explore">Viral</MenuLink>
              <MenuLink to="/public/posts">Posts</MenuLink>
              <Form method="post" action="/logout">
                <button type="submit" className="text-gray-600">
                  Logout
                </button>
              </Form>
            </>
          ) : (
            <>
              <MenuLink to="/public/posts">Posts</MenuLink>
              <MenuLink to="/login" className="border-gray-400 text-gray-400">
                Login
              </MenuLink>
              <MenuLink to="/signup" className="border-gray-400 text-gray-400">
                Sign up
              </MenuLink>
            </>
          )}
        </header>

        <main className="m-0 flex justify-center p-0">
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </main>
      </body>
    </html>
  );
}

function MenuLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "font-semibold" : "font-normal")}
    >
      {children}
    </NavLink>
  );
}
