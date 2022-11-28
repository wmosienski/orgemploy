export interface IEmailService {

    sendEmailConfirmation: (email: string, code: string) => Promise<void>;

}
