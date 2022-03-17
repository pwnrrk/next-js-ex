import type { NextApiRequest, NextApiResponse } from "next";
import User, { UserModel } from "models/user";
import apiHandler, { MethodHandler } from "util/apiHandler";
import { verifyToken } from "util/jwt";
import { connectToDatabase } from "util/mongodb";

const methodHandler: MethodHandler = {
  async GET(request, response) {
    const authUser = verifyToken(request, response);
    if (!authUser) return;
    await connectToDatabase();
    const user = await User.findById(authUser.user_id);
    console.log(user);
    if (user) response.json(user);
  },
  async PATCH(request, response) {
    const authUser = verifyToken(request, response);
    if (!authUser) return;
    await connectToDatabase();
    const user = (await User.findById(authUser.user_id)) as UserModel;
    const body = JSON.parse(request.body) as { [key: string]: any };
    Object.keys(body).forEach((key) => {
      user[key] = body[key];
    });
    await User.findByIdAndUpdate(user._id, user);
    response.json({ status: "ok", message: "User updated" });
  },
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return apiHandler(request, response, methodHandler);
}
