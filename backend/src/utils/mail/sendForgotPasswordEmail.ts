import { env } from '@/utils/envConfig';
import { sendEmail } from './sendEmail';

interface SendForgotPasswordEmailParams {
  to: string;
  resetToken: string;
  name: string;
}

export const sendForgotPasswordEmail = async ({
  to,
  resetToken,
  name,
}: SendForgotPasswordEmailParams) => {
  const resetUrl = `${
    env.FRONTEND_URL
  }/reset-password?token=${resetToken}&email=${encodeURIComponent(to)}`;

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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${env.FRONTEND_URL}/logo.png" alt="Company Logo">
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>This password reset link will expire in 15 minutes.</p>
          <p>If the button doesn't work, copy and paste the following link into your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
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
    subject: 'Reset Your Password',
    html,
  });
};
