import jwt from 'jsonwebtoken';
import Userchat from "../models/userchat.model.js";

const protectRoute = async (req, res, next)=> {
    try {
        const token = req.cookies.jwt;
        //console.log("token = ", token);
        if(!token) {
            return res.status(401).json({message: 'Unauthorised. No token provided'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log("decoded = ", decoded);
        if(!decoded) {
            return res.status(401).json({message: 'Unauthorised. Not decoded'});
        }
        const user = await Userchat.findById(decoded.userId).select('-password');
        //console.log("user = ", user);
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log('Error in message.controller', error.message);
        res.status(500).json({ error: 'Internal server error in protectRouter function'});
    }
}

export default protectRoute;