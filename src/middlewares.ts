import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { NextFunction } from "./types.ts";

export function json() {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.get("Content-Type") === "application/json") {
      try {
        const decoder = new TextDecoder();
        const raw = await Deno.readAll(req.r.body);
        const v = decoder.decode(raw);
        req.body = JSON.parse(v);
      } catch (e) {
        console.error("json: ", e.message);
        res.status(400);
        // req.error = e.message;
        return;
      }
    }
    await next();
  };
}

export function log() {
  return async (req: Request, res: Response, next: NextFunction) => {
    await next();
    console.log(`${req.method}: ${req.url} ${res.statusCode}`);

  };
}
