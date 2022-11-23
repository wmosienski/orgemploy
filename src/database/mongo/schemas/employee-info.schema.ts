import mongoose from 'mongoose';

export const EmployeeInfoSchema = new mongoose.Schema({
    userID: mongoose.Types.ObjectId,
    firstname: String,
    lastname: String,
    experience: Number,
    position: String,
});