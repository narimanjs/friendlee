import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import next from "next";
import setupWebSocketServer from "./server/websocket";
import { randomUUID } from "crypto"; // Для генерации уникальных URL

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url!, true);

    if (parsedUrl.pathname === "/secret") {
      const { key } = parsedUrl.query;
      if (key) {
        const uniquePath = `/secret-frame/${randomUUID()}?key=${key}`;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ url: `http://localhost:3000${uniquePath}` }));
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Key is required" }));
      }
    } else if (parsedUrl.pathname?.startsWith("/secret-frame/")) {
      handle(req, res, parsedUrl);
    } else {
      handle(req, res, parsedUrl);
    }
  });

  setupWebSocketServer(server);

  server.listen(3000, (err?: Error) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });

  const serverAlt = createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      const parsedUrl = parse(req.url!, true);

      if (parsedUrl.pathname === "/secret") {
        const { key } = parsedUrl.query;
        if (key) {
          const uniquePath = `/secret-frame/${randomUUID()}?key=${key}`;
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ url: `http://localhost:3001${uniquePath}` })
          );
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Key is required" }));
        }
      } else if (parsedUrl.pathname?.startsWith("/secret-frame/")) {
        handle(req, res, parsedUrl);
      } else {
        handle(req, res, parsedUrl);
      }
    }
  );

  setupWebSocketServer(serverAlt);

  serverAlt.listen(3001, (err?: Error) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3001");
  });
});
