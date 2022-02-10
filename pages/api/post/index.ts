import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../util/jwt";
import Post from "../../../models/post";
import { connectToDatabase } from "../../../util/mongodb";
import apiHandler, { MethodHandler } from "../../../util/apiHandler";

const methodHandler: MethodHandler = {
  async POST(request, response) {
    const user = verifyToken(request, response);
    if (!user) return;
    const body = JSON.parse(request.body);
    const post = {
      title: body.title,
      description: body.description,
      author_id: user.user_id,
    };
    await connectToDatabase();
    await Post.create(post);
    response.json({ status: "ok", message: "saved!" });
  },
  async PUT(request, response) {
    const user = verifyToken(request, response);
    if (!user) return;
    const body = JSON.parse(request.body);
    const { _id } = body;
    await connectToDatabase();
    const post = await Post.findOneAndUpdate({ _id }, body, { new: true });
    if (post) response.json(post);
  },
  async GET(request, response) {
    await connectToDatabase();
    const posts = await Post.find().limit(10).sort({ createdAt: "desc" });
    response.json(posts);
  },
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return apiHandler(request, response, methodHandler);
}
