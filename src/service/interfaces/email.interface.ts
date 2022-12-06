export interface IEmailService {

    sendEmailConfirmation: (email: string, code: string) => Promise<void>;
    sendEmailConfirmationFromWorkspace: (email: string, code: string) => Promise<void>;

}
