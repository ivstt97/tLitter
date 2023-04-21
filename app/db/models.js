import { mongoose } from "mongoose";

const { Schema } = mongoose;

const addAtSymbol = (username) => {
  if (!username.startsWith("@")) {
    username = `@${username}`;
  }

  return username;
};

//Users Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    set: addAtSymbol,
    unique: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

// Posts Schema
const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    authorId: String,
    title: {
      type: String,
      maxlength: 100,
      minlength: 3,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      maxlength: 500,
      minlength: 5,
    },
    starredBy: {
      type: Array,
    },
  },
  { timestamps: true }
);

export const models = [
  {
    name: "Post",
    schema: postSchema,
    collection: "posts",
  },
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
];
