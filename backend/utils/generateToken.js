import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res)=> {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '20d'
    });
    res.cookie('jwt', token, {
        maxAge: 15*24*60*60*1000, //ms
        httpOnly: true, //prevent XSS attacks
        sameSite: 'strict', //CSRF attacks cross-site request forgery attacks
        secure: process.env.MODE_ENV !== 'development'
    });
}

export default generateTokenAndSetCookie;