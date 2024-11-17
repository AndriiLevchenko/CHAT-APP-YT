import mongoose from 'mongoose';
//import Userchat from "./user.model.js";

const messageSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Userchat', required: true},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: 'Userchat', required: true},
    message: {type: String, required: true}
    // createdAt, updatedAt
}, {timestamps: true});

const Message = mongoose.model('Message', messageSchema);
export default Message;