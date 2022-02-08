import jwt from "jsonwebtoken";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import process from "process";

const config = process.env;

function parseJson(content: string) {
  try {
    return JSON.parse(content);
  } catch (error) {}
}

export function verifyToken(
  request: NextApiRequest,
  response: NextApiResponse,
  next: NextApiHandler
) {
  const token =
    request.headers["x-access-token"] ||
    (request.headers.authorization &&
      request.headers.authorization.split(" ")[1]);
  const prefix = request.headers.authorization
    ? request.headers.authorization.split(" ")[0]
    : "";
  if (!token || prefix !== "Bearer") {
    return response.status(403).send("Invalid Token");
  }
  try {
    if (!config.TOKEN_KEY)
      return response.status(500).send("Internal Exception");
    const decoded = jwt.verify(token as string, config.TOKEN_KEY, {});
    const body = parseJson(request.body);
    if (body) {
      body.user = decoded;
      request.body = JSON.stringify(body);
    } else {
      request.body = JSON.stringify({ user: decoded });
    }
  } catch (error) {
    return response.status(401).send("Unauthorized");
  }
  return next(request, response);
}
