const nodemailer = require('nodemailer');
const env = process.env;
const db = require('../config/db.config');
const sequelize = db.sequelize;
const OTPLog = db.otpLog
const common = require('../controller/common.controller');

let mailModel = {
    sendEmail: async function (toAddress, subject, body, logType, otp) {
        let transporter = nodemailer.createTransport({
            host: env.MAILHOST,
            port: env.MAILPORT,
            secure: false, // use SSL
            name : env.senderEmail,
            tls: {
                rejectUnauthorized:false
            },
            auth: {
                user: env.senderEmail,
                pass: env.senderEmailPassword
            }
        });

        let mailOptions = {
            from: env.senderEmail,
            to: toAddress,
            subject: subject,
            text: body
            // html: body
        };

        return new Promise(async (resolve, reject) => {
            try{
                await transporter.sendMail(mailOptions, async (error, info) => {
                    let emailResponse = "";
                    if (error) {
                        console.log(error)
                        console.log("error")
                        emailResponse = JSON.stringify(error);
                    } else {
                        console.log(info)
                        console.log("info")
                        emailResponse = JSON.stringify(info);
                    }
                    OTPLog.update({is_verified: true},{
                        where: {
                            otp: otp,
                            user_email: toAddress,
                            log_type: logType
                        }
                    }).then(() => {
                        OTPLog.create({
                            otp: otp,
                            user_email: toAddress,
                            email_response: emailResponse,
                            log_type: logType
                        }).then((otpData)=>{
                            return resolve(otpData);
                        }).catch((e)=>{
                            console.log(e)
                        })
                    }).catch((e)=>{
                        console.log(e)
                    })
                });
            } catch (e) {
                console.log(e)
            }
        });
    }
};

module.exports = mailModel;