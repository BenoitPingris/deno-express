import { Route, RouteHandler, Request } from "./types.ts";
import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

export class Router {
  routes: Route[];
  constructor() {
    this.routes = [];
  }

  private getRealPath(path: string) {
    return new URL(path, "about:blank").pathname;
  }

  private add(route: Route) {
    this.routes.push(route);
  }

  public all(url: string, handler: RouteHandler) {
    this.add({ method: "all", url, handler });
  }

  public patch(url: string, handler: RouteHandler) {
    this.add({ method: "patch", url, handler });
  }

  public post(url: string, handler: RouteHandler) {
    this.add({ method: "post", url, handler });
  }

  public get(url: string, handler: RouteHandler) {
    this.add({ method: "get", url, handler });
  }

  public delete(url: string, handler: RouteHandler) {
    this.add({ method: "delete", url, handler });
  }

  public option(url: string, handler: RouteHandler) {
    this.add({ method: "option", url, handler });
  }

  public put(url: string, handler: RouteHandler) {
    this.add({ method: "put", url, handler });
  }

  public async handle(req: ServerRequest) {
    const path = this.getRealPath(req.url);
    const routes = this.routes.filter((o) =>
      o.method.toLowerCase() === req.method.toLowerCase() &&
      o.url.toLowerCase() === path.toLowerCase()
    );

    if (routes.length > 0) {
      for (const route of routes) {
        await route.handler(req);
      }
    } else {
      req.respond({ status: 404, body: "Route not found" });
    }
  }
}
