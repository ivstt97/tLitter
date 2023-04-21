import { json } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { Label, Input, ErrorMessage } from "~/components/formElements";
import { getSession } from "~/sessions.server";
import Button from "../components/Button";

export default function PostForm({
  action,
  errors,
  defaultValues,
  submittedValues,
  username,
}) {
  const transition = useTransition();

  return (
    <Form method="post" action={action} className="text-center">
      <fieldset disabled={transition.state === "submitting"}>
        <Label htmlFor="title">Title</Label>
        <Input
          name="title"
          placeholder="Title"
          className="mb-3 text-slate-700"
          defaultValue={submittedValues?.title ?? defaultValues?.title}
        />
        <ErrorMessage>{errors?.title?.message}</ErrorMessage>

        <Label htmlFor="body">Content</Label>
        <Input
          type="text"
          name="body"
          placeholder="Content"
          className="mb-3 h-48 break-words text-slate-700"
          defaultValue={submittedValues?.body ?? defaultValues?.body}
        />
        <ErrorMessage>{errors?.body?.message}</ErrorMessage>

        <div className="mt-4 flex flex-row justify-center gap-3 text-center">
          <Button type="submit">
            {transition.state === "submitting" ? (
              <span className="flex flex-row items-center gap-2">Saving</span>
            ) : (
              "Save"
            )}
          </Button>
          <Link to={`/user/${username}`}>
            <Button variant="delete">Cancel</Button>
          </Link>
        </div>
      </fieldset>
    </Form>
  );
}
