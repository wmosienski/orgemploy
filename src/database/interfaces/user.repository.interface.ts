import { UserDBO } from "@DBO/user.dbo";

export interface IUserRepository {
    findByID(userID: string): Promise<UserDBO | null>;
    findByEmail(userEmail: string): Promise<UserDBO | null>;
    insertOne(user: UserDBO): Promise<void>;
    insertMany(users: [UserDBO]): Promise<void>;
    updateOne(user: UserDBO): Promise<boolean>;
}