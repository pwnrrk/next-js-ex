import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../util/jwt";
import Post from "../../../models/post";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  verifyToken(request, response, async (request, response) => {
    const body = JSON.parse(request.body);
    const post = {
      title: body.title,
      description: body.description,
      author_id: body.user.user_id,
    };
    try {
      await Post.create(post);
      response.json({ status: "ok", message: "saved!" });
    } catch (error) {
      response.status(500).send("Internal Exception");
    }
  });
}
