import { Route, Routes } from "react-router";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Protect from "./utils/Protect";

import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} /> 
        <Route path="/chat" element={<Protect><Chat /></Protect>} />
      </Routes>

      <ToastContainer position="bottom-right" />
    </>
  )
};

export default App;