import { useLoaderData, useCatch, Form, Outlet } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { json } from "@remix-run/node";
import { useState } from "react";
import moment from "moment";
import { getSession } from "~/sessions.server";
import { Link } from "@remix-run/react";
import Post from "../../../components/Post";
import Button from "../../../components/Button";

export async function loader({ request }) {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");
  const username = session.get("username");

  const db = connectDb();
  const user = await db.models.User.findOne({ _id: userId });

  const posts = await db.models.Post.find({ authorId: userId });

  return json({ posts, avatar: user.avatar, username });
}

export async function action({ request }) {
  const db = connectDb();

  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData);

  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");

  await db.models.User.findByIdAndUpdate(userId, {
    avatar: formDataObject.avatar,
  });

  return null;
}

export default function Index() {
  const { posts, avatar, username } = useLoaderData();
  const [avatarType, setAvatarType] = useState(avatar);
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <div className="flex">
        <Form method="post" className="flex flex-col gap-4 p-4">
          <img
            className="w-20"
            src={`https://avatars.dicebear.com/api/${avatarType}/john.svg?background=%230000ff`}
            alt="avatar"
          />
          <select
            className="bg-slate-500"
            onChange={(e) => setAvatarType(e.target.value)}
            name="avatar"
            id="avatar"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="bottts">Bot</option>
          </select>
          <Button>Change avatar</Button>
        </Form>
        <ul>
          {posts.length < 1 && <div>You don't have any posts yet.</div>}
          {sortedPosts.map((post) => {
            return (
              <Post key={post._id} post={post} username={username}>
                <div className="flex gap-1">
                  <Link
                    to={`${post._id}/edit`}
                    className=" bg-pink-400 py-2 px-3"
                  >
                    Edit
                  </Link>
                  <Form method="delete" action={`${post._id}`}>
                    <Button variant="delete">Delete</Button>
                  </Form>
                </div>
              </Post>
            );
          })}
        </ul>
      </div>
    </>
  );
}
