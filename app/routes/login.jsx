import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import Button from "../components/Button";
import { getSession, commitSession } from "~/sessions.server.js";
import { Label, Input } from "~/components/formElements";
import bcrypt from "bcryptjs";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({ username: session.get("username") });
}

export default function Login() {
  const actionData = useActionData();
  const { username } = useLoaderData();
  return (
    <div className="mt-20 text-center">
      <h1 className="mb-1 text-2xl font-bold">Login</h1>
      {actionData?.errorMessage && (
        <p className="mb-3 rounded border border-red-500 bg-red-50 p-2 text-red-900">
          {actionData?.errorMessage}
        </p>
      )}
      {username ? (
        <div>
          <p>
            You are already logged in as user
            <code className="ml-2 inline-block rounded bg-black p-2 text-white">
              {username}
            </code>
          </p>
          <Form method="post" action="/logout">
            <Button>Logout</Button>
          </Form>
        </div>
      ) : (
        <>
          <Form method="post" reloadDocument>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              defaultValue={actionData?.values?.username}
            />
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              defaultValue={actionData?.values?.password}
            />
            <br />
            <Button className="important mt-3 bg-pink-600 hover:bg-pink-400">
              Login
            </Button>
          </Form>

          <br />
          <h2 className="text-center">
            Don't have an account? <br />
            <Link to="/signup" className="text-center">
              Sign up here
            </Link>
          </h2>
        </>
      )}
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData);
  const session = await getSession(request.headers.get("Cookie"));
  const db = connectDb();

  const user = await db.models.User.findOne({
    username: formData.get("username").trim().replace("@", ""),
  });
  if (!user) {
    return json(
      // Also return values so we can pre-populate the form
      { errorMessage: "User not found", values: formDataObject },
      { status: 404 }
    );
  }
  const passwordIsValid = await bcrypt.compare(
    formData.get("password").trim(),
    user.password
  );
  if (!passwordIsValid) {
    return json(
      { errorMessage: "Invalid password", values: formDataObject },
      { status: 401 }
    );
  }
  session.set("userId", user._id);
  session.set("username", user.username);
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
