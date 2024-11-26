import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // _id: { "type": Number, required: true },
    // _id: mongoose.Schema.Types.ObjectId,
    // _id: mongoose.Schema.ObjectId,
    fullName: { "type": String, required: true },
    username: { "type": String, required: true, unique: true },
    password: { "type": String, required: true, minLength: 6 },
    gender: { "type": String, required: true, enum: ["male", "female"] },
    profilePic: {"type": String, default: ""}
    // createdAt, updatedAt => member since <CreatedAt>
}, {timestamps: true});

const Userchat = mongoose.model("Userchat", userSchema);

export default Userchat

