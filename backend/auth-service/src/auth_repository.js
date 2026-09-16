import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}    
}, {versionKey: false});

const User = mongoose.model('User', userSchema, 'users');

export async function findUserByUsername(username) {
    return await User.findOne({username: username});
};

export async function createUser(data) {
    return await User.create(data);
};