import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
//console.log("server = ", server);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        // credentials: true
    },
});
//console.log("io = ", io);
export const getReceiverSocketId = (receiverId) => {
    //console.log("Looking for socketId for userId:", receiverId);
    const socketId = userSocketMap[receiverId];
    console.log("Found socketId:", socketId);
    return socketId;
};
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("a user connected, socket.id = ", socket.id);
    const userId = socket.handshake.query.userId;
    console.log("userId = ", userId);
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // socket.on() is used to listen to the events. can be used both on client and server side
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    // io.engine.on("connection_error", (err) => {
    //     console.log(err.req);      // the request object
    //     console.log(err.code);     // the error code, for example 1
    //     console.log(err.message);  // the error message, for example "Session ID unknown"
    //     console.log(err.context);  // some additional error context
    // });
});

export { app, io, server };
