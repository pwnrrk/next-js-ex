import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "util/jwt";
import Post, { PostModel } from "models/post";
import { connectToDatabase } from "util/mongodb";
import { Types } from "mongoose";
import apiHandler, { MethodHandler } from "util/apiHandler";
import User, { UserModel } from "models/user";

const methodHandler: MethodHandler = {
  async DELETE(request, response) {
    const user = verifyToken(request, response);
    if (!user) return;
    const { postId } = request.query;
    await connectToDatabase();
    const post = (await Post.findById(
      new Types.ObjectId(postId.toString())
    )) as PostModel;
    if (user.user_id.toString() !== post.author_id?.toString()) return;
    await Post.findByIdAndRemove(post._id);
    response.json({ status: "ok", message: "deleted!" });
  },
  async GET(request, response) {
    const { postId } = request.query;
    await connectToDatabase();
    const post = (await Post.findById(
      new Types.ObjectId(postId.toString())
    )) as PostModel;
    const user = (await User.findById(post.author_id)) as UserModel;
    delete user.password;
    response.json({ post: post, author: user });
  },
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return apiHandler(request, response, methodHandler);
}
