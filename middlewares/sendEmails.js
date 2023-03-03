
import nodemailer from 'nodemailer'
import smtpTransport from "nodemailer-smtp-transport"
const config = require("../config/config.js").get(
  process.env.NODE_ENV || "local"
);
const { EMAIL } = config;

export const sendEmail = async (email, subject, text) => {
  let transport = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: EMAIL.host,
      auth: {
        user: EMAIL.user,
        pass: EMAIL.password,
      },
    })
  );

  const mailOptions = {
    from: EMAIL.user,
    to: email,
    subject: subject,
    html: text,
  };
  console.log(mailOptions, "mailOptions")

  transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
};
