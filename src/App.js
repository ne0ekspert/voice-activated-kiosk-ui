import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from 'framer-motion';
import * as pages from "./pages";
import { FiAlertCircle } from "react-icons/fi";

import "./App.css";

import 라면 from "./res/ft.jpg";
import 치즈 from "./res/gf.jpg";
import 만두 from "./res/sd.jpg";
import 고기 from "./res/rrr.jpg";
import 김밥 from "./res/dt.jpg";
import 돈까스 from "./res/don.jpg";
import 참치 from "./res/cca.jpg";
import 스팸 from "./res/sp.jpg";

const products = [
    {name: '라면', price: 2500, image: 라면},
    {name: '치즈라면', price: 3000, image: 치즈},
    {name: '만두라면', price: 3500, image: 만두},
    {name: '고기라면', price: 4000, image: 고기},
    {name: '김밥', price: 1500, image: 김밥},
    {name: '돈까스김밥', price: 3000, image: 돈까스},
    {name: '참치김밥', price: 2500, image: 참치},
    {name: '스팸김밥', price: 3500, image: 스팸},
];

function IdleIndecator({ setIdle, interactionTimer }) {
  const [countdown, setCountdown] = useState(15);

  const navigate = useNavigate();

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => prev-1);
    }, 1000);

    return () => {
      clearInterval(countdownTimer);
    };
  }, []);

  useEffect(() => {
    if (countdown === 0) onClick_cancel();
  }, [countdown]);

  function onClick_ok() {
    clearTimeout(interactionTimer.current);
    setIdle(false);
    interactionTimer.current = setTimeout(() => {
      setIdle(true);
    }, 30000);
  }

  function onClick_cancel() {
    clearTimeout(interactionTimer.current);
    setIdle(false);
    navigate('/');
  }

  return (
    <div className="fixed flex top-12 h-screen w-screen bg-opacity-80 bg-black items-center justify-center">
      <div className="flex flex-col bg-white rounded-lg h-1/2 w-1/2 p-6 items-center justify-center text-xl">
        <FiAlertCircle size={72} />
        <div className="mt-4 mb-5">
          아직 주문 중이시면 확인 버튼을 눌러주세요: {countdown}
        </div>
        <div className="flex w-full justify-around">
          <button
            className="bg-cyan-800 text-white rounded-full p-3 pl-5 pr-5"
            onClick={onClick_ok}>
            확인
          </button>
          <button
            className="rounded-full border border-black p-3 pl-5 pr-5"
            onClick={onClick_cancel}>
            주문 취소
          </button>
        </div>
      </div>
    </div>
  );
}

function VoiceIndecator({ message, interactionTimer }) {
  const constant_style = "transition h-12 w-screen fixed flex items-center pl-4 font-bold ";
  let style = "";

  console.log(message);

  if (message === "!!!") {
    message = "지금 말하세요";
    style = "bg-white text-cyan-800";
  } else if (message === "...") {
    message = "대답 준비중...";
    style = "bg-cyan-800 text-white";
  } else if (message === "???") {
    message = "음성을 인식하지 못했습니다.";
    style = "bg-red-800 text-white";
  } else if (message.startsWith('INPUT:')) {
    message = message.slice(6);
    style = "bg-white text-cyan-800";
  } else if (message.startsWith('RES:')) {
    message = message.slice(4);
  }

  style = constant_style + style;

  return (
    <div className={style}>
      {message}
    </div>
  );
}

function App() {
  const [ message, setMessage ] = useState("");
  const [ wsState, setWsState ] = useState({nfc: false, voice: false, product: false});
  const [ list, setList ] = useState({});
  const [ idle, setIdle ] = useState(false);

  const ws_voice = useRef(null);
  const ws_product = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const interactionTimer = useRef(0);

  useEffect(() => {
    if (location.pathname === '/') return;

    interactionTimer.current = setTimeout(() => {
      //setIdle(true);
    }, 30000);

    console.log("Idle timer started");

    return () => {
      clearTimeout(interactionTimer.current);
    };
  }, [location]);

  useEffect(() => {
    ws_product.current?.send('cart:'+JSON.stringify(list));
    console.log("Cart data sent");
  }, [list]);

  useEffect(() => {
    ws_product.current?.send('disp:'+location.pathname);
    console.log("Path data sent");
  }, [location.pathname]);

  useEffect(() => {
    ws_product.current = new WebSocket(`ws://${window.location.host}/ws/prod`);
    
    ws_product.current.onopen = () => {
      console.log("Product ws ready");
      let data = products.map(product => ({
        name: product.name,
        price: product.price
      }));
      ws_product.current.send('prod:'+JSON.stringify(data));

      setWsState((prev) => ({...prev, product: true}));
    };

    ws_product.current.onclose = () => {
      console.log("Product ws closed");

      setWsState((prev) => ({...prev, product: false}));
    };

    ws_product.current.onerror = (error) => {
      console.error(error.code, error.message);
    };

    ws_product.current.onmessage = (event) => {
      if (event.data.startsWith("scrn:")) {
        const screen_id = event.data.slice(5);

        navigate(screen_id);
      } else if (event.data.startsWith("cart:")) {
        const cart_str = event.data.slice(5);
        const cart_data = JSON.parse(cart_str);

        setList(cart_data);
      }
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

      setWsState((prev) => ({...prev, voice: true}));
    };

    ws_voice.current.onclose = () => {
      console.log("Voice WS 닫힘");

      setWsState((prev) => ({...prev, voice: false}));
    };

    ws_voice.current.onerror = (error) => {
      console.log(error.code, error.message);
    };
    
    ws_voice.current.onmessage = (event) => {
      console.log(event);
      let m = event.data;

      if (m.startsWith('CART:')) {
        const cart_str = event.data.slice(5);
        const cart_data = JSON.parse(cart_str);

        setList(cart_data);
      } else {
        setMessage(m);
      }
    };

    return () => {
      ws_voice.current?.close();
    };
  }, []);

  function addItem(obj) {
    if (Object.keys(list).includes(obj.name)) {
      setList(prev => ({...prev, [obj.name]: prev[obj.name]+obj.count}));
    } else {
      setList((prev) => ({...prev, [obj.name]: obj.count}));
    }
  }

  function updateItem(name, count) {
    setList(prev => ({[name]: count, ...prev}));
  }

  function removeItem(name) {
    setList((prev) => {
      delete prev[name];
      return prev;
    });
  }

  function reset() {
    setList([]);
    ws_product.current.send('RESET');
    navigate('/');
  }

  return (
    <div className="w-screen h-screen">
      <VoiceIndecator message={message} />

      { idle && <IdleIndecator setIdle={setIdle} interactionTimer={interactionTimer} /> }

      { !(wsState.nfc && wsState.product && wsState.voice ||  true) &&
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

      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route exact path="/" element={<pages.Home />} />
          <Route exact path="/order" element={<pages.Order products={products} addItem={addItem} updateItem={updateItem} removeItem={removeItem} list={list} />} />
          <Route exact path="/payment" element={<pages.Payment products={products} removeItem={removeItem} list={list} reset={reset} />} />
          <Route path="/payment/:method" element={<pages.Payment products={products} removeItem={removeItem} list={list} reset={reset} />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
