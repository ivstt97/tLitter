import { useLoaderData, useCatch, Form, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import { getSession } from "~/sessions.server";
import Post from "../components/Post";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Button from "../components/Button";

export async function loader({ request }) {
  const db = connectDb();

  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");
  const username = session.get("username");

  const posts = await db.models.Post.find();

  if (!posts || posts.length === 0) {
    throw json(
      { message: "Could not find any posts" },
      {
        status: 404,
        statusText: "Posts not found",
      }
    );
  }
  return json({ posts, userId, username });
}

export async function action({ request }) {
  const db = connectDb();

  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData);

  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");

  if (request.method === "DELETE") {
    const db = connectDb();

    await db.models.Post.findByIdAndDelete(formDataObject.postId);

    return redirect(`/public/explore`);
  }

  if (request.method === "POST") {
    const post = await db.models.Post.findById(formDataObject.postId);

    if (post.starredBy.includes(userId)) {
      post.starredBy.pull(userId);
      await post.save();

      return null;
    }

    post.starredBy.push(userId);
    await post.save();

    return null;
  }

  return null;
}

export default function ExplorePostsPage() {
  const { posts, userId, username } = useLoaderData();
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // newest to oldest
  );

  return (
    <div className="flex flex-wrap justify-center">
      <ul className="max-w-xl">
        {sortedPosts.map((post) => {
          const isLiked = post.starredBy.includes(userId);
          const madeByUser = post.authorId === userId;

          return (
            <Post key={post._id} post={post} username={username}>
              {userId && (
                <Form method="post">
                  <input name="postId" type="hidden" value={post._id} />
                  <div className="flex items-center gap-2">
                    <Button>
                      {isLiked ? <ThumbUpOutlinedIcon /> : <ThumbUpIcon />}
                    </Button>
                    {madeByUser && (
                      <Link to={`/user/${username}/${post._id}/edit`}>
                        <Button>edit</Button>
                      </Link>
                    )}
                    {madeByUser && <Button variant="delete">delete</Button>}
                  </div>
                </Form>
              )}
            </Post>
          );
        })}
      </ul>
    </div>
  );
}
