import { Route, Routes } from "react-router";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Protect from "./utils/Protect";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} /> 
        <Route path="/chat" element={<Protect><Chat /></Protect>} />
      </Routes>
    </>
  )
};

export default App;