import { Query, Params, Method } from "./types.ts";
import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";
export class Request {
  url: string;
  query: Query;
  params: Params;
  r: ServerRequest;
  method: Method;
  body: any;
  headers: any;
  constructor(req: ServerRequest) {
    this.r = req;

    const url = new URL("http://dummy.com" + req.url);
    this.url = url.pathname;
    const query: Query = {};
    for (let [k, v] of new URLSearchParams(url.search) as any) {
      if (Array.isArray(query[k])) {
        query[k] = [...query[k], v];
      } else if (typeof query[k] === "string") {
        query[k] = [query[k], v];
      } else {
        query[k] = v;
      }
    }
    this.method = req.method as Method;
    this.params = {};
    this.query = query;
    this.body = {};
    this.headers = req.headers;
  }
}
