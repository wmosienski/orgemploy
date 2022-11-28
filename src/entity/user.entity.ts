import { hash } from "utils/crypt";

export class UserEntity {
    id: string;
    email: string;
    password: string;
    token: string;
    role: string;
    status: string;
    confirmationCode: string;

    public async hashPassword() {
        this.password = await hash(this.password);
    }

    public generateConfirmationCode() {
        this.confirmationCode = `${Math.floor(Math.random() * 9000) + 1000}`;
    }

    public activate() {
        this.status = 'active';
    }
}