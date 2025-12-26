import { createContext, useEffect, useState, useRef, useContext } from "react";
import { io } from 'socket.io-client';
import Peer from 'peerjs';

import { AuthContext } from "./AuthContext";
import { ChatContext } from "./ChatContext";

export const CallContext = createContext();

export const CallProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const { currChat } = useContext(ChatContext);

    const socketRef = useRef();
    const myPeerRef = useRef();
    const localStreamRef = useRef();
    const peersRef = useRef({});
    const myVideoRef = useRef();
    const remoteVideoRef = useRef();
    
    const [callState, setCallState] = useState({ isInCall: false, isRinging: false, isReceivingCall: false, caller: null, callType: null });

    useEffect(() => {
        if (currChat && socketRef.current) {
            socketRef.current.emit('join', currChat);
        }
    }, [currChat]);


    useEffect(() => {
        socketRef.current = io('http://localhost:3000');

        socketRef.current.on('incoming-call', ({ callerId, callerName, callType }) => {
            setCallState({ isInCall: false, isRinging: false, isReceivingCall: true, caller: { id: callerId, name: callerName }, callType });
        });

        socketRef.current.on('call-accepted', () => {
            setCallState(prev => ({ ...prev, isRinging: false, isInCall: true}));

            startWebRTC();
        });

        socketRef.current.on('call-rejected', () => {
            setCallState({ isInCall: false, isRinging: false, isReceivingCall: false, caller: null, callType: null });

            cleanupCall();
        });

        socketRef.current.on('call-ended', () => {
            setCallState({ isInCall: false, isRinging: false, isReceivingCall: false, caller: null, callType: null });

            cleanupCall();
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const startWebRTC = () => {
        myPeerRef.current = new Peer();

        myPeerRef.current.on('open', (peerId) => {
            socketRef.current.emit('join-room', currChat, peerId);
        });

        navigator.mediaDevices.getUserMedia({
            video: callState.callType === 'video',
            audio: true
        }).then(stream => {
            localStreamRef.current = stream;
            
            if (myVideoRef.current) {
                myVideoRef.current.srcObject = stream;
                myVideoRef.current.play();
            };

            myPeerRef.current.on('call', (call) => {
                call.answer(stream);
                
                call.on('stream', (remoteStream) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                        remoteVideoRef.current.play();
                    };
                });
            });

            socketRef.current.on('user-connected', (userId) => {
                connectToNewUser(userId, stream);
            });

            socketRef.current.on('user-disconnected', (userId) => {
                if (peersRef.current[userId]) {
                    peersRef.current[userId].close();
                }
            });
        });
    };

    const connectToNewUser = (userId, stream) => {
        const call = myPeerRef.current.call(userId, stream);
        
        call.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play();
            };
        });

        peersRef.current[userId] = call;
    };

    const initiateCall = (callType) => {
        if (!currChat) {
            alert('Please select a chat first');
            return;
        }

        socketRef.current.emit('initiate-call', {
            chatId: currChat,
            callerId: user._id,
            callerName: user.fullname,
            callType
        });

        setCallState({ isInCall: false, isRinging: true, isReceivingCall: false, caller: null, callType });
    };

    const acceptCall = () => {
        socketRef.current.emit('accept-call', {
            chatId: currChat,
            accepterId: user._id
        });

        setCallState(prev => ({ ...prev, isReceivingCall: false, isInCall: true }));

        startWebRTC();
    };

    const rejectCall = () => {
        socketRef.current.emit('reject-call', {
            chatId: currChat,
            rejecterId: user._id
        });

        setCallState({ isInCall: false, isRinging: false, isReceivingCall: false, caller: null, callType: null });
    };

    const endCall = () => {
        socketRef.current.emit('end-call', {
            chatId: currChat
        });

        setCallState({ isInCall: false, isRinging: false, isReceivingCall: false, caller: null, callType: null });

        cleanupCall();
    };

    const cleanupCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }

        if (myPeerRef.current) {
            myPeerRef.current.destroy();
            myPeerRef.current = null;
        }

        Object.values(peersRef.current).forEach(peer => peer.close());
        peersRef.current = {};
    };

    return (
        <CallContext.Provider value={{ callState, initiateCall, acceptCall, rejectCall, endCall, myVideoRef, remoteVideoRef }}>
            {children}
        </CallContext.Provider>
    );
};