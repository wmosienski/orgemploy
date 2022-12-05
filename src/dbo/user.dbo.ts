export class UserDBO {
    id: string;
    email: string;
    password: string;
    token: string;
    role: string;
    status: string;
    confirmationCode: string;

    public set(id: string, email: string, password: string, token: string, role: string, status: string, confirmationCode: string) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.token = token;
        this.role = role;
        this.status = status;
        this.confirmationCode = confirmationCode;
    }
}