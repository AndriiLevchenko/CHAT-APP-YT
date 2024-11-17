import Userchat from "../models/user.model.js";


export const getUsersForSidebar = async (req, res)=> {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await Userchat.find({_id: {$ne: loggedInUserId}}).select('-password');

        res.status(200).json(filteredUsers);

        console.log('newMessage = ', newMessage);
        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }

        return res.status(201).json(newMessage);

    } catch (error) {
        console.error('Error in message.controller', error.message);
        res.status(500).json({ error: 'Internal server error in User.controller function'});
    }
}
