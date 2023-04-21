import { json, redirect } from "@remix-run/node";
import { useActionData, useCatch, useLoaderData } from "@remix-run/react";
import PostForm from "~/components/PostForm";
import connectDb from "~/db/connectDb.server";
import { getSession } from "~/sessions.server";

export async function loader({ params, request }) {
  const db = connectDb();
  const post = await db.models.Post.findById(params.postId);

  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const username = session.get("username");

  return json({ post, username });
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const db = connectDb();

  try {
    const post = await db.models.Post.findById(params.postId);

    const user = await db.models.User.findById(post.authorId);

    post.title = formData.get("title");
    post.body = formData.get("body");
    await post.save();

    return redirect(`/user/${user.username}/${params.postId}`);
  } catch (error) {
    console.log(error);
    return json(error.errors);
  }
}

export default function EditPost() {
  const actionData = useActionData();
  const { post, username } = useLoaderData();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">edit</h1>
      <PostForm
        username={username}
        defaultValues={post}
        cancelLink={`/posts/${post._id}`}
        errors={actionData}
      />
    </div>
  );
}
