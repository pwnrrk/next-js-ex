import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../util/jwt";
import Post from "../../../models/post";
import { connectToDatabase } from "../../../util/mongodb";
import apiHandler, {
  errorHandler,
  MethodHandler,
} from "../../../util/apiHandler";

const methodHandler: MethodHandler = {
  POST(request, response) {
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
        errorHandler(error, response);
      }
    });
  },
  PUT(request, response) {
    verifyToken(request, response, async (request, response) => {
      try {
        const body = JSON.parse(request.body);
        const { _id } = body;
        await connectToDatabase();
        const post = await Post.findOneAndUpdate({ _id }, body, { new: true });
        if (post) response.status(200).json(post);
      } catch (error) {
        errorHandler(error, response);
      }
    });
  },
  async GET(request, response) {
    try {
      await connectToDatabase();
      const posts = await Post.find().limit(10).sort({ createdAt: "desc" });
      response.json(posts);
    } catch (error) {
      errorHandler(error, response);
    }
  },
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  apiHandler(request, response, methodHandler);
}
