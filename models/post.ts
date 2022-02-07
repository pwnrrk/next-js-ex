import { model, models, Schema, Types } from "mongoose";

const postSchema = new Schema({
  title: { type: String },
  date: { type: String },
  author_id: { type: Types.ObjectId },
});

if (!models.Post) model("Post", postSchema);

export default models.Post;
