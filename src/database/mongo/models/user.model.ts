import mongoose from 'mongoose';
import { UserRegisterDTO } from '@DTO/user-register.dto';
import { UserSchema } from '../schemas';

export const UserModel = mongoose.model<UserRegisterDTO & mongoose.Document>('User', UserSchema);