import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res)=> {
    console.log(" getReceiverSocketId = ",  getReceiverSocketId);

    try {
        const {message} = req.body;
        //console.log("req = ", req);
        //console.log("req.user = ", req.user);
        const {id: receiverId} = req.params;   // the same   const id = req.params.id;
        console.log("receiverId = ", req.params);
        const senderId = req.user._id;
        console.log("senderId = ", senderId);
        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}
        });
        //console.log("participants = ", participants);
        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        //console.log("newMessage = ", newMessage);
        if(newMessage) {
            console.log('newMessage = ', newMessage);
            conversation.messages.push(newMessage._id);
        }
        // SOCKET IO functionality will go here


        // this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json(newMessage);

    } catch (error) {
        console.log('Error in message.controller', error.message);
        res.status(500).json({ error: 'Internal server error in Message.controller function'});
    }
}

export const getMessages = async (req, res)=> {
    try {
        const {id: userToChatId} = req.params;
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants: {$all: [senderId, userToChatId]}
        }).populate("messages");                   // not reference but actual message
        //console.log('conversation = ', conversation);

        if(!conversation) return res.status(200).json([]);
        const messages = conversation.messages;

        res.status(200).json(messages);

    } catch (error) {
        console.log('Error in message.controller in getMessages function', error.message);
        res.status(500).json({ error: 'Internal server error in getMessages function'});
    }
}
