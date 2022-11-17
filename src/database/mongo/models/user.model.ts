import mongoose from 'mongoose';
import { UserDTO } from '@DTO/user.dto';
import { UserSchema } from '../schemas';

export const UserModel = mongoose.model<UserDTO & mongoose.Document>('User', UserSchema);