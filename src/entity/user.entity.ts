import { hash } from "utils/crypt";

export class UserEntity {
    id: string;
    email: string;
    password: string;
    token: string;
    role: string;

    public async hashPassword() {
        this.password = await hash(this.password);
    }
}