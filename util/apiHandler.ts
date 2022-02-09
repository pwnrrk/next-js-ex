import { NextApiRequest, NextApiResponse } from "next";

export type MethodHandler = { [key: string]: CallableFunction };

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
