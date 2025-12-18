import { Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Protect = ({ children }) => {
    const { user } = useContext(AuthContext);

    return user ? children : <Navigate to='/' />
};

export default Protect;