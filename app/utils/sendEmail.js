const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

// const config = require("../config/config.js").get(
//   process.env.NODE_ENV || "local"
// );


exports.sendEmailNode = async (email, subject, text) => {
  let transport = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: process.env.MAILHOST,
      auth: {
        user: process.env.freshEmail,
        pass: process.env.emailPassword,
      },
    })
  );

  const mailOptions = {
    from: process.env.freshEmail,
    to: email,
    subject: subject,
    html: text,
  };

  transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
};


