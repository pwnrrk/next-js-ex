import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../util/jwt";
import Post from "../../../models/post";
import { connectToDatabase } from "../../../util/mongodb";
import { Types } from "mongoose";

const deletePost = (request: NextApiRequest, response: NextApiResponse) => {
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
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case "DELETE":
      deletePost(request, response);
      break;
  }
}
