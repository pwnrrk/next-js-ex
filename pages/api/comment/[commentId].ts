import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../util/jwt";
import Comment, { CommentModel } from "../../../models/comment";
import apiHandler from "../../../util/apiHandler";
import { connectToDatabase } from "../../../util/mongodb";
import { Types } from "mongoose";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return apiHandler(request, response, {
    async DELETE(request, response) {
      await connectToDatabase();
      const user = verifyToken(request, response);
      if (!user) return;
      const { commentId } = request.query;
      const comment = (await Comment.findById(
        new Types.ObjectId(commentId.toString())
      )) as CommentModel;
      if (!user.user_id.equals(comment.user_id)) return;
      await Comment.findOneAndRemove({
        _id: comment._id,
      });
      response.json({ status: "ok", message: "Comment deleted" });
    },
  });
}
