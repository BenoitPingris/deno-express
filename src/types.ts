import { Request } from "./request.ts";
import { Response } from "./response.ts";

export type Method =
  | "POST"
  | "GET"
  | "PATCH"
  | "DELETE"
  | "OPTION"
  | "ALL"
  | "PUT";

export type NextFunction = () => void;

export interface Query {
  [key: string]: string | string[];
}

export interface Params {
  [key: string]: string;
}

export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export interface Route {
  method: Method;
  url: string;
  handler: RouteHandler;
}
