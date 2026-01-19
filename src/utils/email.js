import nodemailer from 'nodemailer';

export const sendEmail = async (options) =>{
       // create an email transport
       const transport = nodemailer.createTransport({
              host: process.env.EMAIL_HOST,
              port: process.env.EMAIL_PORT,
              auth: {
                     user: process.env.EMAIL_USER,
                     pass: process.env.EMAIL_PASS
              }
       });

       // Define the email options

       const message = {
              from: `EatsNow <noreply@eatnow.com>`,
              to: options.email,
              subject: options.subject,
              text: options.text,
              html: options.html
       };


       // send the email
       await transport.sendMail(message);
}
