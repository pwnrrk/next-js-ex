import { model, models, Schema, Types } from "mongoose";

export interface CommentModel {
  _id: Types.ObjectId;
  post_id: Types.ObjectId;
  user_id: Types.ObjectId;
  content: string;
}

const commentSchema = new Schema(
  {
    post_id: { type: Types.ObjectId },
    user_id: { type: Types.ObjectId },
    content: { type: String },
  },
  {
    timestamps: true,
  }
);

if (!models.Comment) model("Comment", commentSchema);
const Comment = models.Comment;

export default Comment;
