import Userchat from "../models/userchat.model.js";
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res)=> {
    try {
        console.log('SignUp User');

        const {fullName, username, password, confirmPassword, gender} = req.body;
        console.log('fullName, username, password, confirmPassword, gender', fullName, username, password, confirmPassword, gender);
        if(password !== confirmPassword) {
            return res.status(400).json({error: "Passwords do not match"})
        }

        const userchatOld = await Userchat.findOne({username});
        console.log('SignUp User, userchat', userchatOld);
        if(userchatOld) {
            return res.status(400).json({error: "User already exists"})
        }

        //Hash password here
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy&username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl&username=${username}`;

        const userData = {fullName, username, password: hashedPassword, gender, profilePic: gender === "male" ? boyProfilePic : girlProfilePic};
        const userchat = new Userchat(userData);
        if(userchat) {
            // Generate JWT token
            generateTokenAndSetCookie(userchat._id, res);
            await userchat.save();
            console.log('newUser userchat = ', userchat);
            res.status(201).json({
                _id: userchat._id,
                fullName: userchat.fullName,
                username: userchat.username,
                profilePic: userchat.profilePic
            });
        } else {
            res.status(400).json({error: 'Invalid user data'});
        }
    } catch (error) {
        console.log('Error in SignUp controller', error.message);
        res.status(500).json({ error: 'Internal server error  реально'});
    }
}

export const login = async (req, res)=> {
   try {
       const {username, password} = req.body;
       const user = await Userchat.findOne({username});
       //console.log("user = ", user);
       const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');
       if(!user || !isPasswordCorrect) {
           return res.status(400).json({error: 'Invalid username or password'})
       }
       generateTokenAndSetCookie(user._id, res);
       res.status(200).json({
           _id: user._id,
           fullName: user.fullName,
           username: user.username,
           profilePic: user.profilePic
       })
   } catch (error) {
       console.log('Error in Login controller', error.message);
       res.status(500).json({ error: 'Internal server error  реально in Login function'});
   }
}

export const logout =(req, res)=> {
    try {
        console.log('Logout in Auth controller staert');
        res.cookie('jwt', '', {maxAge: 0});
        res.status(200).json({message: 'Logged out successfully'});
    } catch (error) {
        console.log('Error in Logout controller', error.message);
        res.status(500).json({ error: 'Internal server error in Logout function'});
    }
}

