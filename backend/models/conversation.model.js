import mongoose from 'mongoose';
import Userchat from "./user.model.js";

const conversationSchema = new mongoose.Schema({
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'Userchat'}],
    messages: [{type: mongoose.Schema.Types.ObjectId,  ref: 'Message', default: []}]

    // createdAt, updatedAt
}, {timestamps: true});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;