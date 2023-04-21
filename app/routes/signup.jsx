import { Form, useActionData } from "@remix-run/react";
import { Label, Input, ErrorMessage } from "~/components/formElements";
import Button from "../components/Button";
import connectDb from "~/db/connectDb.server.js";
import { json, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";

export async function action({ request }) {
  const db = connectDb();
  const formData = await request.formData();
  const user = db.models.User;
  let data = Object.fromEntries(formData);
  if (data.password === "" || data.username === "" || data.email === "") {
    return json(
      { errorMessage: "Please fill out all fields", values: data },
      { status: 400 }
    );
  }

  if (data.password !== data.passwordConfirm) {
    return json(
      { errorMessage: "Passwords do not match", values: data },
      { status: 400 }
    );
  } else {
    const hashedPassword = await bcrypt.hash(data.password.trim(), 10);
    const newUser = new user({
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      avatar: "male",
    });
    await newUser.save();
    return redirect("/login");
  }
}

export default function SignUp() {
  const dataAction = useActionData();

  return (
    <div className="mt-10 text-center">
      <h1 className="mb-1 text-2xl font-bold">Sign Up</h1>

      <Form method="post">
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="text-slate-700"
        />

        <Label htmlFor="firstName">First Name</Label>
        <Input
          type="text"
          name="firstName"
          id="firstName"
          placeholder="firstName"
          className="text-slate-700"
        />

        <Label htmlFor="lastName">Last Name</Label>
        <Input
          type="text"
          name="lastName"
          id="lastName"
          placeholder="lastName"
          className="text-slate-700"
        />

        <Label htmlFor="email">Email Address</Label>
        <Input
          type="text"
          name="email"
          id="email"
          placeholder="email"
          className="text-slate-700"
        />

        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="text-slate-700"
          defaultValue={dataAction?.values?.password}
        />

        <Label htmlFor="passwordConfirm">Confirm Password</Label>
        <Input
          type="password"
          name="passwordConfirm"
          id="passwordConfirm"
          placeholder="Repeat Password"
          className="text-slate-700"
          defaultValue={dataAction?.values?.passwordConfirm}
        />
        <br />
        <ErrorMessage>{dataAction?.errorMessage}</ErrorMessage>
        <br />
        <Button type="submit">Sign Up</Button>
      </Form>
    </div>
  );
}
