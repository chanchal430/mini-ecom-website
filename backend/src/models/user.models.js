import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    name: {
        type: String,
        required: true,
        minLength: [2, "Minimum 2 Characters Required"],
        maxLength: [50, "Maximum 50 Characters Required"]
    },
    passwordHash: {
        type: String,
        required: true,
        minLength: [6, "Minimum 6 Characters required"],
    },
    role: {
        type: String,
        enum: ["user", "seller"],
        default: "user"
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);

export default userModel;