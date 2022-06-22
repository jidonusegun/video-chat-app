import React, { createContext, useRef, useState, useEffect} from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

export const SocketContext = createContext();

const socket = io('https://segun-video-app.herokuapp.com/');

export default function ContextProvider({children}) {
    const [stream, setStream] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');
    const connectionRef = useRef();
    const userVideo = useRef();
    const myVideo = useRef()

    useEffect(() => {
        const getCamera = async() => {
            const currentStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});

            setStream(currentStream)
            myVideo.current.srcObject = currentStream
        }
        getCamera();
        socket.on('me', (id) => setMe(id));

        socket.on('calluser', ({from, name: callerName, signal}) => {
            setCall({ isReceiverCall: true, from, name: callerName, signal})
        })
    },[])

    const answerCall = () => {
        setCallAccepted(true)

        const peer = new Peer({ initiator: false, trickle: false, stream});

        peer.on('signal', (data) => {
            socket.emit('answercall', {signal: data, to: call.from});
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    }
    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream});

        peer.on('signal', (data) => {
            socket.emit('calluser', {userToCall: id, signalData: data, from: me, name });
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on('callaccepted', (signal) => {
            setCallAccepted(true);

            peer.signal(signal);
        })

        connectionRef.current = peer;
    }
    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    }

    return (
        <SocketContext.Provider 
            value={{
                stream,
                callAccepted,
                callEnded,
                name, 
                call,
                me,
                userVideo,
                myVideo,
                setName,
                answerCall,
                callUser,
                leaveCall
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}