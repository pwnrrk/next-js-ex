import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export type MethodHandler = {
  [key: string]: NextApiHandler;
};

export function errorHandler(error: any, response: NextApiResponse) {
  console.trace(error);
  response.status(500).send("Internal Exception");
}

function isPromise(p: any) {
  if (typeof p === "object" && typeof p.then === "function") {
    return true;
  }
  return false;
}

function apiHandler(
  request: NextApiRequest,
  response: NextApiResponse,
  methodHandler: MethodHandler
) {
  return new Promise((resolve) => {
    try {
      const method = request.method;
      if (method) {
        const func = methodHandler[method.toUpperCase()];
        if (func) {
          const call = func(request, response);
          if (call && isPromise(call)) {
            call.then(() => resolve(null));
          } else {
            resolve(null);
          }
        } else {
          response.status(404).send("Not found");
          resolve(null);
        }
      } else {
        response.status(404).send("Not found");
        resolve(null);
      }
    } catch (error) {
      errorHandler(error, response);
      resolve(null);
    }
  });
}

export default apiHandler;
