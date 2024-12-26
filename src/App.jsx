import FirebaseDataFetch from "./components/Dashboard";
import LoginPage from "./components/Login.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<FirebaseDataFetch />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
