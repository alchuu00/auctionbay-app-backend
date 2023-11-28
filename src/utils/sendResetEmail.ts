import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

const sendResetEmail = async (email, subject, payload, template) => {
  try {
    const transporter = nodemailer.createTransport({
      service: `${process.env.SMTP_SERVICE}`,
      host: `${process.env.SMTP_HOST}`,
      secure: false,
      port: `${process.env.SMTP_PORT}`,
      auth: {
        user: `${process.env.SMTP_USER}`,
        pass: `${process.env.SMTP_PASS}`,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });

    console.log('Preparing to send email...');
    console.log('Reading template file...');
    const filePath = path.join(__dirname, `../../src/utils/${template}`);
    console.log('File path:', filePath);
    const source = fs.readFileSync(filePath, 'utf8');
    console.log('Compiling template...');
    const compiledTemplate = handlebars.compile(source);
    const options = {
      from: 'alchuu00@outlook.com',
      to: email,
      subject: subject,
      html: compiledTemplate(payload),
    };
    console.log('Email options prepared, attempting to send...');

    // Send email
    try {
      const info = await transporter.sendMail(options);
      console.log('Email sent: ', info);
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  } catch (error) {
    return error;
  }
};

export default sendResetEmail;
