import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import * as pages from "./pages";
import { v4 } from "uuid";

import "./App.css";

import 라면 from "./res/ft.jpg";
import 떡라면 from "./res/gf.jpg";
import 만두 from "./res/sd.jpg";
import 고기 from "./res/rrr.jpg";
import 김밥 from "./res/dt.jpg";
import 돈까스 from "./res/don.jpg";
import 참치 from "./res/cca.jpg";
import 스팸 from "./res/sp.jpg";

const products = [
    {name: '라면', price: 3000, image: 라면},
    {name: '떡라면', price: 3500, image: 떡라면},
    {name: '만두라면', price: 3500, image: 만두},
    {name: '고기라면', price: 4000, image: 고기},
    {name: '김밥', price: 1500, image: 김밥},
    {name: '돈까스김밥', price: 2500, image: 돈까스},
    {name: '참치김밥', price: 2500, image: 참치},
    {name: '스팸김밥', price: 3000, image: 스팸},
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
