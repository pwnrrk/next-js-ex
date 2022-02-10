import { NextApiRequest, NextApiResponse } from "next";

export type MethodHandler = {
  [key: string]: (request: NextApiRequest, response: NextApiResponse) => any;
};

export function errorHandler(error: any, response: NextApiResponse) {
  console.trace(error);
  response.status(500).send("Internal Exception");
}

function apiHandler(
  request: NextApiRequest,
  response: NextApiResponse,
  methodHandler: MethodHandler
) {
  const method = request.method?.toUpperCase();
  if (method) {
    methodHandler[method](request, response);
  }
}

export default apiHandler;
