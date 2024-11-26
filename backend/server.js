import path from "path";
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

import {app, server} from "./socket/socket.js";
const PORT  = process.env.PORT || 5000;
//const app = express();
dotenv.config();

const __dirname = path.resolve();
// console.log("path = ", path);
console.log("__dirname = ", __dirname);


app.use(express.json());  //to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/userchats', userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, ()=> {
    connectToMongoDB();
    console.log(`Server running onon port ${PORT} також внатурі`);
})

// import cors from 'cors';

// import connectDB from "./config/mongodb.js";
// import connectCloudinary from "./config/cloudinary.js";
// import adminRouter from "./routes/adminRoute.js";
// import doctorRouter from "./routes/doctorRoute.js";
// import userRouter from "./routes/userRoute.js";
//
//

// connectDB()
// connectCloudinary()
//
// app.use(express.json())
// app.use(cors())
// // app.use(cors({ origin: 'http://127.0.0.1:4000' }))
//
// app.use('/api/admin', adminRouter)
// app.use('/api/doctor', doctorRouter)
// app.use('/api/user', userRouter)
//
// //           localhost:4000/api/admin/add-doctor

//
// app.listen(port, () => console.log(`Server started on PORT:${port}`))