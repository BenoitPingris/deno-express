import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

export class Response {
  req: ServerRequest;
  statusCode: number;

  constructor(req: ServerRequest) {
    this.req = req;
    this.statusCode = 200;
  }

  public send(s: string): Response {
    this.req.respond({ status: this.statusCode, body: s });
    return this;
  }

  public json(o: object): Response {
    const headers = new Headers();
    headers.append("Content-type", "application/json");
    this.req.respond(
      { status: this.statusCode, body: JSON.stringify(o), headers },
    );
    return this;
  }

  public status(status: number): Response {
    this.statusCode = status;
    return this;
  }
}
