import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../models/user";
import apiHandler, { MethodHandler } from "../../util/apiHandler";
import { verifyToken } from "../../util/jwt";
import { connectToDatabase } from "../../util/mongodb";

const methodHandler: MethodHandler = {
  async GET(request, response) {
    const authUser = verifyToken(request, response);
    if (!authUser) return;
    await connectToDatabase();
    const user = await User.findById(authUser.user_id);
    if (user) response.json(user);
  },
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return apiHandler(request, response, methodHandler);
}
