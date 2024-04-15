import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import * as pages from "./pages";

import "./App.css";

function App() {
  const [ message, setMessage ] = useState("");
  const [ list, setList ] = useState([]);

  const webSocket = useRef(null);

  useEffect(() => {
    webSocket.current = new WebSocket('ws://localhost:8080');

    webSocket.current.onopen = () => {
      console.log("WS 연결됨");
    };

    webSocket.current.onclose = () => {
      console.log("WS 닫힘");
    };

    webSocket.current.onerror = (error) => {
      console.log(error);
    };

    webSocket.current.onmessage = (event) => {
      console.log(event);
    };

    return () => {
      webSocket.current?.close();
    };
  }, []);

  function addItem(obj) {
    setList((prev) => [...prev, obj]);
  }

  return (
    <div className="w-screen h-screen">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<pages.Home />} />
          <Route exact path="/order" element={<pages.Order addItem={addItem} list={list} />} />
          <Route exact path="/payment" element={<pages.Payment />} list={list} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
