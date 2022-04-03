type RequestOption = {
  headers?: object;
  body?: object | string;
  query?: { [key: string]: string | undefined } | string;
};

function makeInput(options?: RequestOption) {
  //Convert body
  if (options?.body) options.body = JSON.stringify(options.body);
  //Join query
  if (options?.query && typeof options.query === "object") {
    const query: string[] = [];
    for (let key in options.query) {
      if (options.query.hasOwnProperty(key)) {
        const value = options.query[key];
        if (value && value !== "") query.push(`${key}=${options.query[key]}`);
      }
    }
    options.query = query.join("&");
  }
  return options;
}

async function fetcher(method: string, url: string, options?: RequestOption) {
  const res = await fetch(
    `${url}${options?.query ? "?" + options.query : ""}`,
    {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: options?.body?.toString(),
    }
  );
  const data = await res.json();
  if (res.ok) return { data, error: undefined };
  return { data: undefined, error: data };
}

type ResourceRequest = (
  url: string,
  options?: RequestOption
) => Promise<{ data?: any; error?: any }>;

type ResourceRequests = {
  [key: string]: ResourceRequest;
  get: ResourceRequest;
  post: ResourceRequest;
  patch: ResourceRequest;
  put: ResourceRequest;
  delete: ResourceRequest;
};

const resource: ResourceRequests = {
  get: (url, options) => fetcher("GET", url, makeInput(options)),
  post: (url, options) => fetcher("POST", url, makeInput(options)),
  put: (url, options) => fetcher("PUT", url, makeInput(options)),
  patch: (url, options) => fetcher("PATCH", url, makeInput(options)),
  delete: (url, options) => fetcher("DELETE", url, makeInput(options)),
};

export default resource;
