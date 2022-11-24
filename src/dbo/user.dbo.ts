export class UserDBO {
    id: string;
    email: string;
    password: string;
    token: string;
    role: string;

    public set(id: string, email: string, password: string, token: string, role: string) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.token = token;
        this.role = role;
    }
}