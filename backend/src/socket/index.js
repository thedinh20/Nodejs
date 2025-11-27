import { Server} from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware} from "../middlewares/socketMiddleware.js";
import {getUserConversationForSockerIO} from "../controllers/conversationController.js"

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});

io.use(socketAuthMiddleware);

const onlineUsers = new Map();// { userId: sockerId}

io.on("connection", async (socket) => {
    const user = socket.user;
    console.log(`${user.displayName} online voi socker: ${socket.id}`);

    onlineUsers.set(user._id, socket.id);

    io.emit("online-users", Array.from(onlineUsers.keys()))

    const conversationIds = await getUserConversationForSockerIO(user._id);
    conversationIds.forEach((id) => {
        socket.join(id);
    });
    socket.on("disconnect", () => {
        onlineUsers.delete(user._id);
        io.emit("online-users", Array.from(onlineUsers.keys()))
        console.log(`socket disconnected: ${socket.id}`)

    });
});

export { io, app, server};