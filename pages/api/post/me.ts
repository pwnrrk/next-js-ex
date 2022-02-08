import { NextApiRequest, NextApiResponse } from "next";
import Post from "../../../models/post";
import { verifyToken } from "../../../util/jwt";
import { connectToDatabase } from "../../../util/mongodb";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  verifyToken(request, response, async (request, response) => {
    const user_id = JSON.parse(request.body).user.user_id;
    await connectToDatabase();
    const posts = await Post.find({ author_id: user_id });
    response.json(posts);
  });
}
