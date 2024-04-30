import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import * as pages from "./pages";
import { v4 } from "uuid";

import "./App.css";

const products = [
    {name: '신라면', price: 1500, image: null},
    {name: '진라면', price: 1500, image: null},
    {name: '육개장', price: 1500, image: null}
];

function App() {
  const [ message, setMessage ] = useState("");
  const [ list, setList ] = useState([]);

  const webSocket = useRef(null);

  useEffect(() => {
    webSocket.current = new WebSocket(`ws://${window.location.host}/ws`);

    webSocket.current.onopen = () => {
      console.log("WS 연결됨");
    };

    webSocket.current.onclose = () => {
      console.log("WS 닫힘");
    };

    webSocket.current.onerror = (error) => {
      console.log(error.code, error.message);
    };

    webSocket.current.onmessage = (event) => {
      console.log(event);
      let m = event.data;
      let ans = "";
      
      if (m.includes('## 대답')) {
        ans = m.split("## 대답")[1].strip();
        setMessage(ans);
      }
    };

    return () => {
      webSocket.current?.close();
    };
  }, []);

  function addItem(obj) {
    obj.id = v4();

    setList((prev) => [...prev, obj]);
  }

  function updateItem(id, obj) {
    let updatedData = [...list];

    list.forEach((v, i) => {
      if (v.id === id) updatedData[i] = { ...updatedData[i], ...obj };
      setList(updatedData);
    });
  }

  return (
    <div className="w-screen h-screen">
      <div className="fixed w-full">
        {message}
      </div>

      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<pages.Home />} />
          <Route exact path="/order" element={<pages.Order products={products} addItem={addItem} updateItem={updateItem} list={list} />} />
          <Route exact path="/payment" element={<pages.Payment products={products} updateItem={updateItem} list={list}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
