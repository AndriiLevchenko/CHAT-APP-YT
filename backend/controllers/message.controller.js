import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res)=> {
    try {
        const {message} = req.body;
        const {id: receiverId} = req.params;   // the same   const id = req.params.id;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}
        });
        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }
        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            message: message
        })
        console.log('newMessage = ', newMessage);
        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }
        // SOCKET IO functionality will go here


        // this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

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
        console.log('conversation = ', conversation);

        if(!conversation) return res.status(200).json([]);
        const messages = conversation.messages;

        res.status(200).json(messages);

    } catch (error) {
        console.log('Error in message.controller in getMessages function', error.message);
        res.status(500).json({ error: 'Internal server error in getMessages function'});
    }
}
