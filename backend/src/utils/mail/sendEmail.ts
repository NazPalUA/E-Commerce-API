import { InternalServerError } from '@/errors/server-error';
import { env } from '@/utils/envConfig';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const createTransporter = () => {
  const transportOptions: SMTPTransport.Options = {
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_SECURE,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  return nodemailer.createTransport(transportOptions);
};

const verifyTransporter = async (transporter: nodemailer.Transporter) => {
  try {
    await transporter.verify();
    console.log('Email service is ready');
  } catch (error) {
    console.error('Email service configuration error:', error);
    throw new InternalServerError('Email service configuration failed');
  }
};

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  const transporter = createTransporter();
  await verifyTransporter(transporter);

  try {
    const info = await transporter.sendMail({
      from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new InternalServerError('Failed to send email');
  }
};
