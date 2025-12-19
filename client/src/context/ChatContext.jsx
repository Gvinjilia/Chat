import { useRef, useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import { io } from 'socket.io-client';

export const ChatContext = createContext();

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [currChat, setCurrChat] = useState(null);
    const [chats, setChats] = useState([]);

    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_API_URL, {
            transports: ["websocket"]
        });

        socketRef.current.on("message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => socketRef.current.disconnect();
    }, []);

    const joinChat = (chatId) => {
        socketRef.current.emit("join", chatId);
        setCurrChat(chatId);
    };

    useEffect(() => {
        if (!currChat || !socketRef.current) return;
        socketRef.current.emit('join', currChat);

        const fetchMessages = async () => {
            const res = await fetch(`${API_URL}/messages/${currChat}`, {
                credentials: 'include'
            });
            const data = await res.json();

            setMessages(data);
        };

        fetchMessages();
    }, [currChat]);

    const sendMessage = async (formData) => {
        try {
            const res = await fetch(`${API_URL}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message)
            };
        } catch(err){
            console.log(err);
        }
    };

    const getChats = async () => {
        try {
            const res = await fetch(`${API_URL}/chat/`, {
                credentials: 'include'
            });

            const data = await res.json();

            setChats(data);
        } catch(err){
            console.log('err', err);
        };
    };

    const createChat = async (formData) => {
        const toastId = toast.loading('creating a chat...');

        try {
            const res = await fetch(`${API_URL}/chat/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            setCurrChat(data._id);

            toast.update(toastId, {
                render: 'Chat created successfully',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            });

            setChats([...chats, data]);
        } catch(err){
            toast.update(toastId, {
                render: `Error: ${err.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 2000
            });
        };
    };

    const search = async (q) => {
        try {
            const res = await fetch(`${API_URL}/chat/users?query=${q}`, {
                credentials: 'include'
            });

            if(!res.ok){
                const data = await res.json();
                throw new Error(data.message);
            };

            return res.json();
        } catch(err){
            console.log('err', err);
        };
    };

    return (
        <ChatContext.Provider value={{ messages, sendMessage, createChat, currChat, chats, getChats, joinChat, search }}>
            {children}
        </ChatContext.Provider>
    )
};