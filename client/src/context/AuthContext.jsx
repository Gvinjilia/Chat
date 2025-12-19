import { useState, createContext } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const signup = async (formData) => {
        const toastId = toast.loading('signing in...');

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

            toast.update(toastId, {
                render: 'account created successfully!',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            });
            
            navigate('/');
        } catch(err){
            toast.update(toastId, {
                render: `Error: ${err.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 2000
            });
        };
    };

    const login = async (formData) => {
        const toastId = toast.loading('logging in...');

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

            toast.update(toastId, {
                render: 'You have logged in sucessfully',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            });

            navigate('/chat')
        } catch(err){
            toast.update(toastId, {
                render: `Error: ${err.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 2000
            });
        };
    };

    const logout = () => {
        const toastId = toast.loading('logging out...');
        
        setUser(null);

        toast.update(toastId, {
            render: 'logged our successfully!',
            type: 'success',
            isLoading: false,
            autoClose: 2000
        });

        navigate('/');
    };

    return (
        <AuthContext.Provider value={{signup, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
};