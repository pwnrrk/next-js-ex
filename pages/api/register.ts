import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "models/user";
import { connectToDatabase } from "util/mongodb";
import apiHandler, { MethodHandler } from "util/apiHandler";

const methodHandler: MethodHandler = {
  async POST(request, response) {
    await connectToDatabase();
    const userData = request.body;
    const oldUser = await User.findOne({ email: userData.email });

    if (oldUser)
      return response
        .status(409)
        .json({ status: "failed", message: "User already register" });

    const encryptedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = encryptedPassword;
    const user = await User.create(userData);
    const token = jwt.sign(
      {
        user_id: user._id,
        email: user.email,
      },
      process.env.TOKEN_KEY as string,
      {
        expiresIn: "3d",
      }
    );
    user.token = token;
    response.json({
      status: "ok",
      message: "saved!",
      data: user,
    });
  },
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return apiHandler(request, response, methodHandler);
}
