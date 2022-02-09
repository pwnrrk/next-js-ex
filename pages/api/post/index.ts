import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../util/jwt";
import Post from "../../../models/post";
import { connectToDatabase } from "../../../util/mongodb";
import apiHandler, { MethodHandler } from "../../../util/apiHandler";

const methodHandler: MethodHandler = {
  POST(request: NextApiRequest, response: NextApiResponse) {
    verifyToken(request, response, async (request, response) => {
      const body = JSON.parse(request.body);
      const post = {
        title: body.title,
        description: body.description,
        author_id: body.user.user_id,
      };
      try {
        await connectToDatabase();
        await Post.create(post);
        response.json({ status: "ok", message: "saved!" });
      } catch (error) {
        response.status(500).send("Internal Exception");
      }
    });
  },
  PUT(request: NextApiRequest, response: NextApiResponse) {
    verifyToken(request, response, async (request, response) => {
      try {
        const body = JSON.parse(request.body);
        const { _id } = body;
        await connectToDatabase();
        const post = await Post.findOneAndUpdate({ _id }, body, { new: true });
        if (post) response.status(200).json(post);
      } catch (error) {
        console.trace(error);
        response.status(500).send("Internal Exception");
      }
    });
  },
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  apiHandler(request, response, methodHandler);
}
