import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../models/user";
import { verifiyToken } from "../../util/jwt";
import { connectToDatabase } from "../../util/mongodb";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  verifiyToken(request, response, async (request, response) => {
    await connectToDatabase();
    const user_id = JSON.parse(request.body).user.user_id;
    const user = await User.findById(user_id);
    if (user) response.json(user);
  });
}
