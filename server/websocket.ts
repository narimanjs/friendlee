import { WebSocketServer } from "ws";

function setupWebSocketServer(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", ws => {
    console.log("WebSocket connection established");

    ws.on("message", message => {
      console.log("received:", message.toString());
      const key = message.toString();

      const interval = setInterval(() => {
        ws.send(key);
      }, 5000);

      ws.on("close", () => {
        clearInterval(interval);
      });
    });
  });

  console.log("WebSocket Server ready");
}

export default setupWebSocketServer;
