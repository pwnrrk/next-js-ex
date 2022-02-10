import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../util/jwt";
import Post, { PostModel } from "../../../models/post";
import { connectToDatabase } from "../../../util/mongodb";
import { Types } from "mongoose";
import apiHandler, { MethodHandler } from "../../../util/apiHandler";
import User, { UserModel } from "../../../models/user";

const methodHandler: MethodHandler = {
  DELETE(request: NextApiRequest, response: NextApiResponse) {
    verifyToken(request, response, async (request, response) => {
      try {
        const { postId } = request.query;
        await connectToDatabase();
        await Post.findOneAndRemove({
          _id: new Types.ObjectId(postId.toString()),
        });
        response.json({ status: "ok", message: "deleted!" });
      } catch (error) {
        console.trace(error);
        response.status(500).send("Internal Exception");
      }
    });
  },
  async GET(request: NextApiRequest, response: NextApiResponse) {
    try {
      const { postId } = request.query;
      await connectToDatabase();
      const post = (await Post.findById(
        new Types.ObjectId(postId.toString())
      )) as PostModel;
      const user = (await User.findById(post.author_id)) as UserModel;
      delete user.password;
      response.json({ post: post, author: user });
    } catch (error) {
      console.trace(error);
      response.status(500).send("Internal Exception");
    }
  },
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  apiHandler(request, response, methodHandler);
}
