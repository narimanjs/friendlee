import { WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { parse } from "url";

function setupWebSocketServer(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req: IncomingMessage) => {
    console.log("WebSocket connection established");

    const parsedUrl = parse(req.url!, true);
    const key = parsedUrl.query.key as string;

    if (!key) {
      ws.close(4001, "Key is required");
      return;
    }

    ws.on("message", message => {
      console.log("received:", message.toString());
    });

    const interval = setInterval(() => {
      ws.send(key);
    }, 5000);

    ws.on("close", () => {
      clearInterval(interval);
    });
  });

  console.log("WebSocket Server ready");
}

export default setupWebSocketServer;
