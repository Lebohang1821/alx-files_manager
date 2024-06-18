import fs from 'fs';
import readline from 'readline';
import { promisify } from 'util';
import mimeMessage from 'mime-message';
import { gmail_v1 as gmailV1, google } from 'googleapis';

// If modifying these scopes, removes token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = 'token.json';
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

/**
 * Stores new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for authorized client.
 */
async function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error retrieving access token', err);
        return;
      }
      oAuth2Client.setCredentials(token);
      writeFileAsync(TOKEN_PATH, JSON.stringify(token))
        .then(() => {
          console.log('Token stored to', TOKEN_PATH);
          callback(oAuth2Client);
        })
        .catch((writeErr) => console.error(writeErr));
    });
  });
}

/**
 * It makes OAuth2 client with the given credentials, and then execute
 * given callback function.
 * @param {Object} credentials authorization client credentials.
 * @param {function} callback The callback to call with authorized client.
 */
async function authorize(credentials, callback) {
  const clientSecret = credentials.web.client_secret;
  const clientId = credentials.web.client_id;
  const redirectURIs = credentials.web.redirect_uris;
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectURIs[0],
  );
  console.log('Client authorization beginning');
  // Check if we have previously stored token.
  await readFileAsync(TOKEN_PATH)
    .then((token) => {
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    }).catch(async () => getNewToken(oAuth2Client, callback));
  console.log('Client authorization done');
}

/**
 * It delivers mail through user's account.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {gmailV1.Schema$Message} mail The message to send.
 */
function sendMailService(auth, mail) {
  const gmail = google.gmail({ version: 'v1', auth });

  gmail.users.messages.send({
    userId: 'me',
    requestBody: mail,
  }, (err, _res) => {
    if (err) {
      console.log(`The API returned an error: ${err.message || err.toString()}`);
      return;
    }
    console.log('Message sent successfully');
  });
}

/**
 * Contains routines for mail delivery with GMail.
 */
export default class Mailer {
  static checkAuth() {
    readFileAsync('credentials.json')
      .then(async (content) => {
        await authorize(JSON.parse(content), (auth) => {
          if (auth) {
            console.log('Auth check was successful');
          }
        });
      })
      .catch((err) => {
        console.log('Error loading client secret file:', err);
      });
  }

  static buildMessage(dest, subject, message) {
    const senderEmail = process.env.GMAIL_SENDER;
    const msgData = {
      type: 'text/html',
      encoding: 'UTF-8',
      from: senderEmail,
      to: [dest],
      cc: [],
      bcc: [],
      replyTo: [],
      date: new Date(),
      subject,
      body: message,
    };

    if (!senderEmail) {
      throw new Error(`Invalid sender: ${senderEmail}`);
    }
    if (mimeMessage.validMimeMessage(msgData)) {
      const mimeMsg = mimeMessage.createMimeMessage(msgData);
      return { raw: mimeMsg.toBase64SafeString() };
    }
    throw new Error('Invalid MIME message');
  }

  static sendMail(mail) {
    readFileAsync('credentials.json')
      .then(async (content) => {
        await authorize(
          JSON.parse(content),
          (auth) => sendMailService(auth, mail),
        );
      })
      .catch((err) => {
        console.log('Error loading client secret file:', err);
      });
  }
}
