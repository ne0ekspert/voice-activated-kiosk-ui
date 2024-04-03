import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as pages from "./pages";

import "./App.css";

function App() {
  return (
    <div className="w-screen h-screen">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<pages.Home />} />
          <Route exact path="/order" element={<pages.Order />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
