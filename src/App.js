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
    {name: '라면', price: 2500, image: 라면},
    {name: '떡라면', price: 3000, image: 떡라면},
    {name: '만두라면', price: 3500, image: 만두},
    {name: '고기라면', price: 4000, image: 고기},
    {name: '김밥', price: 1500, image: 김밥},
    {name: '돈까스김밥', price: 3000, image: 돈까스},
    {name: '참치김밥', price: 2500, image: 참치},
    {name: '스팸김밥', price: 3500, image: 스팸},
];

function App() {
  const [ message, setMessage ] = useState("");
  const [ list, setList ] = useState([]);

  const ws_voice = useRef(null);
  const ws_product = useRef(null);
  const ws_nfc = useRef(null);

  useEffect(() => {
    ws_nfc.current = new WebSocket(`ws://${window.location.host}/ws/nfc`);
    
    ws_nfc.current.onopen = () => {
      console.log("NFC ws ready");
      ws_nfc.current.send('connected');
    };

    ws_nfc.current.onclose = () => {
      console.log("NFC ws closed");
    };

    ws_nfc.current.onerror = (error) => {
      console.log(error.code, error.message);
    };

    ws_nfc.current.onmessage = (event) => {
      console.log(event);
    };

    return () => {
      ws_nfc.current?.close();
    };
  }, []);

  useEffect(() => {
    ws_product.current = new WebSocket(`ws://${window.location.host}/ws/prod`);
    
    ws_product.current.onopen = () => {
      console.log("Product ws ready");
      ws_product.current.send('connected');
    };

    ws_product.current.onclose = () => {
      console.log("Product ws closed");
    };

    ws_product.current.onerror = (error) => {
      console.log(error.code, error.message);
    };

    ws_product.current.onmessage = (event) => {
      console.log(event);
    };

    return () => {
      ws_product.current?.close();
    };
  }, []);

  useEffect(() => {
    ws_voice.current = new WebSocket(`ws://${window.location.host}/ws/voice`);

    ws_voice.current.onopen = () => {
      console.log("Voice ws ready");
      ws_voice.current.send('connected');
    };

    ws_voice.current.onclose = () => {
      console.log("WS 닫힘");
    };

    ws_voice.current.onerror = (error) => {
      console.log(error.code, error.message);
    };

    ws_voice.current.onmessage = (event) => {
      console.log(event);
      let m = event.data;
      let ans = "";
      
      if (m.includes('## 대답')) {
        ans = m.split("## 대답")[1].strip();
        setMessage(ans);
      }
    };

    return () => {
      ws_voice.current?.close();
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

  function removeItem(id) {
    setList((prev) => prev.filter((v) => v.id !== id))
  }

  return (
    <div className="w-screen h-screen">
      <div className="fixed w-full">
        {message}
      </div>

      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<pages.Home />} />
          <Route exact path="/order" element={<pages.Order products={products} addItem={addItem} updateItem={updateItem} removeItem={removeItem} list={list} />} />
          <Route exact path="/payment" element={<pages.Payment products={products} updateItem={updateItem} removeItem={removeItem} list={list} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
