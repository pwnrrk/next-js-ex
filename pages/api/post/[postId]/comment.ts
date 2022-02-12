import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "util/jwt";
import Comment from "models/comment";
import apiHandler, { errorHandler, MethodHandler } from "util/apiHandler";
import { connectToDatabase } from "util/mongodb";
import { Types } from "mongoose";
import User from "models/user";

const methodHandler: MethodHandler = {
  async GET(request, response) {
    try {
      const { postId } = request.query;
      await connectToDatabase();
      const comments = await Comment.find({
        post_id: new Types.ObjectId(postId.toString()),
      });
      const users = await User.find({
        _id: { $in: comments.map((c) => c.user_id) },
      });
      const results = comments.map((comment) => ({
        comment,
        user: users.find(
          (user) => user._id.toString() === comment.user_id.toString()
        ),
      }));
      response.json(results);
    } catch (error) {
      errorHandler(error, response);
    }
  },
  async POST(request, response) {
    const user = verifyToken(request, response);
    if (!user) return;
    const body = JSON.parse(request.body);
    const { postId } = request.query;
    const { content } = body;
    await connectToDatabase();
    const comment = await Comment.create({
      post_id: new Types.ObjectId(postId.toString()),
      content,
      user_id: user.user_id,
    });
    response.json(comment);
  },
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return apiHandler(request, response, methodHandler);
}
