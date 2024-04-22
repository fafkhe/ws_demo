import express from "express";
import { connectDB } from "./db";
import _applyRoutes from "./routes";
import cors from "cors";
import { WebSocketServer } from "ws";

export var sockserver;
(async function bootstrap() {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());
  _applyRoutes(app);

  app.listen(3000, () => console.log("listening on port 3000"));

  sockserver = new WebSocketServer({ port: 443 });

  sockserver.on("connection", (ws) => {
    console.log("New client connected!");

    ws.send("connection established");

    ws.on("close", () => console.log("Client has disconnected!"));

    ws.onerror = function () {
      console.log("websocket error");
    };
  });
})();
