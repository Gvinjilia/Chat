import { useState, createContext } from "react";
import { useNavigate } from "react-router";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const signup = async (formData) => {
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message)
            };
            
            navigate('/');
        } catch(err){
            console.log(err);
        }
    };

    const login = async (formData) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            setUser(data);

            navigate('/chat')
        } catch(err){
            console.log(err);
        }
    };

    const logout = () => {
        setUser(null);

        navigate('/');
    };

    return (
        <AuthContext.Provider value={{signup, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
};