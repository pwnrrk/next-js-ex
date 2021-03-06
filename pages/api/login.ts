import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "models/user";
import { connectToDatabase } from "util/mongodb";
import apiHandler, { MethodHandler } from "util/apiHandler";

const methodHandler: MethodHandler = {
  async POST(request, response) {
    await connectToDatabase();
    const { email, password } = request.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return response
        .status(404)
        .json({ status: "no_user", message: "No user founded" });
    const verified = await bcrypt.compare(password, user.password);
    if (!verified)
      return response
        .status(401)
        .json({ status: "invalid", message: "Invalid creadentials" });
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY as string,
      { expiresIn: "3d" }
    );
    user.token = token;
    response.json({ status: "ok", message: "success", data: user });
  },
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return apiHandler(request, response, methodHandler);
}
