import { Form, Link, useLoaderData, useCatch } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "~/sessions.server";
import Post from "../../../components/Post";
import Button from "../../../components/Button";
import { requireUserSession } from "../../../sessions.server";

export async function loader({ params, request }) {
  await requireUserSession(request);
  const db = connectDb();
  const post = await db.models.Post.findById(params.postId);

  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const username = session.get("username");

  if (!post) {
    throw new Response("Could not find the post you were looking for", {
      status: 404,
    });
  }

  return json({ post, username });
}

export async function action({ request, params }) {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");

  if (request.method === "DELETE") {
    const db = connectDb();

    const user = await db.models.User.findById(userId);

    await db.models.Post.findByIdAndDelete(params.postId);

    return redirect(`/user/${user.username}`);
  }
  return null;
}

export default function PostPage() {
  const { post, username } = useLoaderData();

  return (
    <Post key={post._id} post={post} username={username}>
      {username && (
        <div className="flex gap-2">
          <Link to={`edit`}>
            <Button>Edit</Button>
          </Link>

          <Form method="delete">
            <Button variant="delete">Delete</Button>
          </Form>
        </div>
      )}
    </Post>
  );
}
