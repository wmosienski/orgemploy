import { injectable } from 'inversify';
import 'reflect-metadata';
import { IEmailService } from './interfaces/email.interface';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import path from 'path';
import fs from 'fs/promises'

const TOKEN_PATH = path.join(process.cwd(), 'gmail_token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'gmail_client_secret.json');

@injectable()
export class EmailService implements IEmailService {

    public async sendEmailConfirmation(code: string, email: string): Promise<void> {
        const auth = await this.authorize();

        const gmail = google.gmail({version: 'v1', auth});

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: this.makeBody(email, 'orgemploy@employ.org', 'email confirmation', `Hi, this is your confirmation code: ${code}`),
            }
        });
    }

    private async loadSavedCredentialsIfExist() {
        try {
          const content = await fs.readFile(TOKEN_PATH, 'ascii');

          const credentials = JSON.parse(content);

          return google.auth.fromJSON(credentials);
        } catch (err) {
          return null;
        }
      }

    private async authorize() {
        const SCOPES = [
            'https://mail.google.com/',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.compose',
            'https://www.googleapis.com/auth/gmail.send'
        ];

        let client: any = await this.loadSavedCredentialsIfExist();

        if (client) {
            return client;
        }

        client = await authenticate({
          scopes: SCOPES,
          keyfilePath: CREDENTIALS_PATH,
        });

        if (client.credentials) {
          await this.saveCredentials(client);
        }

        return client;
    }

    private async saveCredentials(client: any) {
        const content = await fs.readFile(CREDENTIALS_PATH, 'ascii');

        const keys = JSON.parse(content);

        const key = keys.installed || keys.web;

        const payload = JSON.stringify({
          type: 'authorized_user',
          client_id: key.client_id,
          client_secret: key.client_secret,
          refresh_token: client.credentials.refresh_token,
        });

        await fs.writeFile(TOKEN_PATH, payload);
    }

    private makeBody(to: string, from: string, subject: string, message: string) {
        const str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
            "MIME-Version: 1.0\n",
            "Content-Transfer-Encoding: 7bit\n",
            "to: ", to, "\n",
            "from: ", from, "\n",
            "subject: ", subject, "\n\n",
            message
        ].join('');

        const encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');

        return encodedMail;
    }

}