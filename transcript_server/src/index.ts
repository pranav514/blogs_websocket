import WebSocket from "ws";
import { translation } from "./translation";
const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", (ws) => {
  console.log("pranav");
  ws.on("error", console.error);
  ws.on("message", async (data: any) => {
    // console.log("console log the data", data);
    const messages = JSON.parse(data);
    console.log(messages);
    if (messages.type === "textSend") {
      const response = await translation(messages.message, messages.language);
      console.log("response text", response);
      ws.send(
        JSON.stringify({
          type: "translatedText",
          message: response,
        })
      );
    }
  });
});
