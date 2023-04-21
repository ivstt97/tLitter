import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import PostForm from "~/components/PostForm";
import { useActionData, useCatch } from "@remix-run/react";
import { requireUserSession } from "~/sessions.server";
import { getSession } from "~/sessions.server";

export async function action({ request }) {
  requireUserSession(request);

  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");
  const username = session.get("username");

  const formData = await request.formData();
  const data = {
    authorId: userId,
    title: formData.get("title"),
    body: formData.get("body"),
  };
  const db = connectDb();
  try {
    const newPost = new db.models.Post(data);
    await newPost.save();
    return redirect(`/user/${username}`);
  } catch (error) {
    console.log(error);
    return json(error.errors);
  }
}

export default function CreatePost() {
  const actionData = useActionData();

  return (
    <div className="mt-10">
      <h1 className="mb-1 text-center text-2xl font-bold">Create Post</h1>
      <PostForm cancelLink="/posts" errors={actionData} />
    </div>
  );
}
