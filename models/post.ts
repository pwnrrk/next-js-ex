import { model, models, Schema, Types } from "mongoose";

export interface PostModel {
  [key: string]: any;
  _id?: Types.ObjectId;
  title: string;
  description: string;
  author_id?: Types.ObjectId;
  createdAt?: string;
  updatedAt?: string;
}

const postSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    date: { type: String },
    author_id: { type: Types.ObjectId },
  },
  {
    timestamps: true,
  }
);

if (!models.Post) model("Post", postSchema);

const Post = models.Post;

export default Post;
