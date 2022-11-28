import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    token: String,
    role: String,
    status: String,
    confirmationCode: String,
});