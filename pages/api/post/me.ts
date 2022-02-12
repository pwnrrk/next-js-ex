import { NextApiRequest, NextApiResponse } from "next";
import Post from "models/post";
import apiHandler from "util/apiHandler";
import { verifyToken } from "util/jwt";
import { connectToDatabase } from "util/mongodb";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return apiHandler(request, response, {
    async GET(request, response) {
      const user = verifyToken(request, response);
      if (!user) return;
      await connectToDatabase();
      const posts = await Post.find({ author_id: user.user_id });
      response.json(posts);
    },
  });
}
