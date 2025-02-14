import Home from "./pages/Home";
import Weather from "./pages/Weather";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/weather" element={<Weather />} />
    </Routes>
  );
}

export default App;
