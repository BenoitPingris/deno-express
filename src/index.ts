import {
  serve,
  Server,
  ServerRequest,
} from "https://deno.land/std@0.50.0/http/server.ts";
import { Method, RouteHandler, Route, NextFunction } from "./types.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { json, log } from "./middlewares.ts";

class Application {
  s: Server;

  routes: Route[];
  middlewares: RouteHandler[];

  constructor(public port: number) {
    this.s = serve({ port });
    this.routes = [];
    this.middlewares = [];
  }

  add(method: Method, url: string, handler: RouteHandler) {
    this.routes.push({
      method,
      url,
      handler,
    });
  }

  get(route: string, handler: RouteHandler) {
    this.add("GET", route, handler);
  }

  post(route: string, handler: RouteHandler) {
    this.add("POST", route, handler);
  }

  delete(route: string, handler: RouteHandler) {
    this.add("DELETE", route, handler);
  }

  patch(route: string, handler: RouteHandler) {
    this.add("PATCH", route, handler);
  }

  put(route: string, handler: RouteHandler) {
    this.add("PUT", route, handler);
  }

  all(route: string, handler: RouteHandler) {
    this.add("ALL", route, handler);
  }

  option(route: string, handler: RouteHandler) {
    this.add("OPTION", route, handler);
  }

  use(m: RouteHandler) {
    this.middlewares.push(m);
  }

  async listen(cb: () => void) {
    cb();
    for await (const r of this.s) {
      const req = new Request(r);
      const res = new Response(r);
      await this.handleMiddlewares(this.middlewares, req, res, r);
      await this.handleRoutes(req, res, r);
    }
  }

  async handleRoutes(req: Request, res: Response, r: ServerRequest) {
    for (const route of this.routes) {
      if (route.method === req.method) {
        if (route.url.toLowerCase() === req.url.toLowerCase()) {
          return route.handler(req, res, () => {});
        }
      }
    }
    r.respond({ status: 404, body: "Route not found." });
  }

  async handleMiddlewares(
    middlewares: RouteHandler[],
    req: Request,
    res: Response,
    r: ServerRequest,
  ) {
    if (middlewares.length > 0) {
      const [m, ...rest] = middlewares;
      await this.execMiddleware(
        m,
        req,
        res,
        () => this.handleMiddlewares(rest, req, res, r),
      );
    }
  }

  async execMiddleware(
    m: RouteHandler,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    await m(req, res, next);
  }

  stop() {
    this.s.close();
  }
}

const server = new Application(8000);

server.use(json());
server.use(log())
server.post("/", async (req, res) => {
  console.log(req.body.e);
  res.json({ w: "qwewq" });
});

server.listen(() => console.log(`server ::${8000}`));
