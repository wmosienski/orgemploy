import { IUserRepository } from "@Database/interfaces/user.repository.interface";
import { UserDBO } from "dbo/user.dbo";
import { injectable } from "inversify";
import { UserModel } from "./models";

@injectable()
export class UserRepository implements IUserRepository {
    async findByID(userID: string): Promise<UserDBO | null> {
        const user = await UserModel.findById(userID);
        if (user?._id) {
            const userDBO = new UserDBO();
            userDBO.set(user?._id, user?.email, user?.password, user?.token, user?.role, user?.status, user?.confirmationCode);
            return userDBO; 
        }
        return null;
    }
    async findByEmail(email: string): Promise<UserDBO | null> {
        const user = await UserModel.findOne({email});
        if (user?._id) {
            const userDBO = new UserDBO()
            userDBO.set(user?._id, user?.email, user?.password, user?.token, user?.role, user?.status, user?.confirmationCode);
            return userDBO; 
        }
        return null;
    }
    async insertOne(user: UserDBO): Promise<void> {
        await UserModel.create(user);
    }
    async insertMany(users: [UserDBO]): Promise<void> {
        await UserModel.insertMany(users);
    }
    async updateOne(user: UserDBO): Promise<boolean> {
        const updateResult = await UserModel.updateOne({_id: user.id}, user);
        if (updateResult?.modifiedCount !== 1) {
            return false;
        }
        return true;
    }
    
}