import { env } from '@/utils/envConfig';
import { sendEmail } from './sendEmail';

interface SendVerificationEmailParams {
  to: string;
  verificationToken: string;
  name: string;
}

export const sendVerificationEmail = async ({
  to,
  verificationToken,
  name,
}: SendVerificationEmailParams) => {
  const verificationUrl = `${
    env.FRONTEND_URL
  }/verify-email?verificationToken=${verificationToken}&email=${encodeURIComponent(
    to
  )}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 50px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .header img {
          max-width: 150px;
        }
        .content {
          line-height: 1.6;
          color: #333333;
        }
        .button {
          display: inline-block;
          padding: 12px 25px;
          margin: 30px 0;
          background-color: #4CAF50;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777777;
          margin-top: 20px;
        }
        @media only screen and (max-width: 600px) {
          .container {
            margin: 20px;
            padding: 15px;
          }
          .button {
            width: 100%;
            box-sizing: border-box;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${env.FRONTEND_URL}/logo.png" alt="Company Logo">
        </div>
        <div class="content">
          <h2>Welcome, ${name}!</h2>
          <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" class="button">Verify Email</a>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>If the button doesn't work, copy and paste the following link into your browser:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: 'Verify your email address',
    html,
  });
};
