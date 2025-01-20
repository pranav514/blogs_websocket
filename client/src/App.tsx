import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [sendtext, setsendText] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:8080");
    setSocket(webSocket);

    webSocket.onopen = () => {
      console.log("WebSocket connection established");
    };

    webSocket.onmessage = (event) => {
      const messages = JSON.parse(event.data);
      if (messages.type === "translatedText") {
        console.log(messages.message.trans);

        setResponse(messages.message.trans);
      }
    };

    webSocket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    webSocket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }, []);

  const sendText = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "textSend",
          message: sendtext,
          language: language,
        })
      );
    } else {
      console.error("WebSocket is not connected yet.");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={sendtext}
        onChange={(e) => {
          setsendText(e.target.value);
        }}
      />
      <input
        type="text"
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value);
        }}
      />
      <p>{response}</p>
      <button onClick={sendText}>Send</button>
    </div>
  );
}

export default App;
