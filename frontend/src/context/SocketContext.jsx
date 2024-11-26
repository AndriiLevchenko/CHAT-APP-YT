import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            // const socket = io("https://chat-app-yt.onrender.com", {
            const socket = io("http://localhost:5000", {
                query: {
                    userId: authUser._id,
                },
            });
console.log("socket = ", socket);
            setSocket(socket);

            // socket.on() is used to listen to the events. can be used both on client and server side
            socket.on("getOnlineUsers", (userchats) => {
                setOnlineUsers(userchats);
            });

            return () => socket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);
    console.log("socket in useState = ", socket);
    return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
