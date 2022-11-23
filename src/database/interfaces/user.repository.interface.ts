import { UserDBO } from "dbo/user.dbo";

export interface IUserRepository {
    findByID(userID: string): Promise<UserDBO | void>;
    findByEmail(userEmail: string): Promise<UserDBO | void>;
    insertMany(users: [UserDBO]): Promise<void>;
    updateOne(user: UserDBO): Promise<boolean>;
}