import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import process from "process";

const config = process.env;

type DecodedUser = { user_id: Types.ObjectId; email: string };

export function verifyToken(
  request: NextApiRequest,
  response: NextApiResponse
): DecodedUser | undefined {
  const token =
    request.headers["x-access-token"] ||
    (request.headers.authorization &&
      request.headers.authorization.split(" ")[1]);
  const prefix = request.headers.authorization
    ? request.headers.authorization.split(" ")[0]
    : "";
  if (!token || prefix !== "Bearer") {
    response.status(403).send("Invalid Token");
    return;
  }
  try {
    if (!config.TOKEN_KEY) {
      response.status(500).send("Internal Exception");
      return;
    }
    const decoded = jwt.verify(
      token.toString(),
      config.TOKEN_KEY,
      {}
    ) as DecodedUser;
    return decoded;
  } catch (error) {
    response.status(401).send("Unauthorized");
    return;
  }
}
