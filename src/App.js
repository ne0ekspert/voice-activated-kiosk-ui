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
  const [ wsState, setWsState ] = useState({nfc: false, voice: false, product: false});
  const [ list, setList ] = useState([]);

  const messageBox = useRef(null);

  const ws_voice = useRef(null);
  const ws_product = useRef(null);
  const ws_nfc = useRef(null);

  useEffect(() => {
    ws_nfc.current = new WebSocket(`ws://${window.location.host}/ws/nfc`);
    
    ws_nfc.current.onopen = () => {
      console.log("NFC ws ready");
      ws_nfc.current.send('connected');

      setWsState((prev) => ({...prev, nfc: true}));
    };

    ws_nfc.current.onclose = () => {
      console.log("NFC ws closed");

      setWsState((prev) => ({...prev, nfc: false}));
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
    ws_product.current?.send('cart:'+JSON.stringify(list));
    console.log("Cart data sent");
  }, [list]);

  useEffect(() => {
    ws_product.current = new WebSocket(`ws://${window.location.host}/ws/prod`);
    
    ws_product.current.onopen = () => {
      console.log("Product ws ready");
      ws_product.current.send('prod:'+JSON.stringify(products));

      setWsState((prev) => ({...prev, product: true}));
    };

    ws_product.current.onclose = () => {
      console.log("Product ws closed");

      setWsState((prev) => ({...prev, product: false}));
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
    function findItems(text) {
      const regex = /<(.+?)>/gi; // Same regex as before
      const textElements = [];
      let match;

      while ((match = regex.exec(text)) !== null) {
        textElements.push(match[1]);
      }

      return textElements;
    }

    ws_voice.current = new WebSocket(`ws://${window.location.host}/ws/voice`);

    ws_voice.current.onopen = () => {
      console.log("Voice ws ready");
      ws_voice.current.send('connected');

      setWsState((prev) => ({...prev, voice: true}));
    };

    ws_voice.current.onclose = () => {
      console.log("WS 닫힘");

      setWsState((prev) => ({...prev, voice: false}));
    };

    ws_voice.current.onerror = (error) => {
      console.log(error.code, error.message);
    };

    ws_voice.current.onmessage = (event) => {
      console.log(event);
      let m = event.data;
      
      if (m.startsWith('INPUT:')) {
        setMessage(m.slice(6));
      } else if (m.startsWith('RES:')) {
        const text = m.slice(4);
        const items = findItems(text);

        let ans = "";

        if (text.includes('## 대답')) {
          ans = text.split('## 대답')[1].trim();
        }

        console.log(ans);
        console.log(items);

        setMessage(ans);

        items.forEach((v) => {
          if (v.startsWith('!')) {
            console.log(v.slice(1));
            removeItem(v.slice(1));
          } else {
            const [name, count] = v.split(':');

            addItem({name: name, count: count});
          }
        });
      } else if (m === "***") {
        setMessage("");
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
      <div className="fixed w-screen h-5 bg-white text-blue-800 transition" ref={messageBox}>
        {message}
      </div>

      { !(wsState.nfc && wsState.product && wsState.voice ) &&
        <div className="fixed w-screen h-screen bg-opacity-80 bg-black flex text-white">
          <table className="w-full h-16">
            <tbody>
              <tr><th>NFC 상태</th><td>{wsState.nfc ? 'SUCCESS' : 'FAILED'}</td></tr>
              <tr><th>품목 상태</th><td>{wsState.product ? 'SUCCESS' : 'FAILED'}</td></tr>
              <tr><th>음성 인식</th><td>{wsState.voice ? 'SUCCESS' : 'FAILED'}</td></tr>
            </tbody>
          </table>
        </div>
      }

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
