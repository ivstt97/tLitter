import { Link } from "@remix-run/react";
import moment from "moment/moment";

const Post = ({ post, children, username }) => {
  const { _id, title, body, createdAt, starredBy } = post;

  const simpleDate = moment(createdAt).format("HH:mm LL");

  return (
    <div
      className="mb-10 max-w-full break-words border-b-2 pb-1 pt-1"
      key={post._id}
    >
      <Link to={`/user/${username}/${_id}`}>
        <li className="list-none">
          <div className="mb-3">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p>{body}</p>
          </div>
          <div className="">
            <small>Likes: {starredBy.length} </small>
            <small> Created at: {simpleDate} </small>
          </div>
          <br />
        </li>
      </Link>
      {children}
    </div>
  );
};

export default Post;
