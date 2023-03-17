const bcrypt = require('bcrypt')
const { success, error } = require('../utils/restResponse')
const jwt = require('jsonwebtoken')
const CONSTANT = require('../assets/constants')
const common = require('./common.controller')
const env = process.env
const sendMail = require('../utils/sendMail')
const mailTemplate = require('../utils/mailTemplate')

const db = require('../config/db.config')
const Staff = db.staff
const OTPLog = db.otpLog

exports.login = (req, res) => {
    let param = req.body
    try{
        Staff.findOne({ where: { email: param.email }, attributes: ['id','is_active' ,'email', 'fname', 'lname', 'password', 'is_sub_admin'] }).then(async data => {
            if (data == null || data == '') {
                return res.send(error('Invalid email id!'))
            }
            let u = data.get({ plain: true })
            let validUser = bcrypt.compareSync(param.password, u.password)
    
            if (!validUser) {
                return res.send(error('Invalid Password!'))
            }
    
            if (!u.is_active) {
                return res.send(error('User is inactive!', CONSTANT.ERROR_STATUS))
            }

            const token = jwt.sign({ master_id: u.id, master: u }, env.JWT_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            })
    
            u.token = token
            delete u.password
    
            return res.send(success("Logged in successfully!",u))
    
        }).catch(e => {
            console.log(e)
            return res.send(error(CONSTANT.SQL_ERROR))
        })
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANT.SQL_ERROR))
    }
}

exports.changePassword = (req, res) => {
    let param = req.body
    let masterId = req.master_id

    try {        
        Staff.findOne({ where: { id: masterId } }).then(async data => {
            if (data == null || data == '') {
                return res.send(error('Invalid User!', CONSTANT.ERROR_STATUS))
            }
            let u = data.get({ plain: true })

            if (!u.is_active) {
                return res.send(error('User is inactive!', CONSTANT.ERROR_STATUS))
            }

            let validUser = bcrypt.compareSync(req.body.oldpassword, u.password)
            if (!validUser) {
                return res.send(error('Old password does not match!'))
            }

            let password = await bcrypt.hash(param.newpassword, bcrypt.genSaltSync(8))

            Staff.update({ password: password},{ where: { id: masterId }}).then((data1) => {
                return res.send(success("Password changes successfully!"))
            }).catch(async (e) => {
                console.log(e)
                return res.send(error(CONSTANT.SQL_ERROR))
            })
        }).catch(e => {
            console.log(e)
            return res.send(error(CONSTANT.SQL_ERROR))
        })
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANT.SERVER_ERROR))
    }
}

exports.forgotPasswordEmail = (req, res) => {
    let param = req.body
    try{
        Staff.findOne({ where: { email: param.email } }).then(async data => {
            if (data == null || data == '') {
                return res.send(error('Invalid email!', CONSTANT.ERROR_STATUS))
            }
            let u = data.get({ plain: true })
    
            if (!u.is_active) {
                return res.send(error('User is inactive!', CONSTANT.ERROR_STATUS))
            }
    
            // let otp = 1234
            let otp = await common.generateOTP()
    
            let hostURL = req.protocol + "://" + req.get('host')
            const otpMailTemplate = await mailTemplate.forgotPasswordOTPMail(u.name, hostURL, otp)
    
            sendMail.sendEmail(param.email, "Forgot Password", otpMailTemplate, env.forgotPasswordLogType, otp, u.id)
    
            return res.send(success("OTP sent successfully to email!"))
        }).catch(e => {
            console.log(e)
            return res.send(error(CONSTANT.SQL_ERROR))
        })
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANT.SERVER_ERROR))
    }
}

exports.forgotPasswordOTPVerify = (req, res) => {
    let param = req.body
    try{
        OTPLog.count({ where: 
            {
                user_email: param.email,
                otp: param.otp,
                is_verified: false
                // timediff: sequelize.fn('timestampdiff', 'minute', sequelize.col('created_at'), sequelize.fn('currdate')),
            }
        }).then((otpData) => {
            if (otpData > 0) {
                OTPLog.update({is_verified: true},{
                    where: {
                        otp: param.otp,
                        user_email: param.email,
                    }
                }).then(() => {
                    Staff.findOne({
                        attributes: ['hashcode','email'],
                        where: { email: param.email }
                    }).then((staffHash)=>{
                        return res.send(success("OTP verified!",staffHash))
                    }).catch(async (e) => {
                        console.log(e)
                        return res.send(error(CONSTANT.SQL_ERROR))
                    })
                }).catch(async (e) => {
                    console.log(e)
                    return res.send(error(CONSTANT.SQL_ERROR))
                })
            } else {
                return res.send(error("OTP is invalid/expired!"))
            }
        }).catch(async (e) => {
            console.log(e)
            return res.send(error(CONSTANT.SQL_ERROR))
        })
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANT.SERVER_ERROR))
    }
}

exports.forgotPasswordReset = (req, res) => {
    let param = req.body
    try{
        OTPLog.count({ where: 
            {
                user_email: param.email,
                otp: param.otp,
                is_verified: true
                // timediff: sequelize.fn('timestampdiff', 'minute', sequelize.col('created_at'), sequelize.fn('currdate')),
            }
        }).then((otpData) => {
            if (otpData > 0) {
        Staff.findOne({ where: { email: param.email } }).then(async data => {
            if (data == null || data == '') {
                return res.send(error('Invalid credentials!', CONSTANT.ERROR_STATUS))
            }

            let u = data.get({ plain: true })
    
            if (!u.is_active) {
                return res.send(error('User is inactive!', CONSTANT.ERROR_STATUS))
            }
            
            OTPLog.count({ where: 
                {
                    user_email: param.email,
                    otp: param.otp,
                    is_verified: false
                    // timediff: sequelize.fn('timestampdiff', 'minute', sequelize.col('created_at'), sequelize.fn('currdate')),
                }
            }).then(async () => {
                let password = await bcrypt.hashSync(param.password, bcrypt.genSaltSync(8))
               
            Staff.update({ password: password},{ where: { id: u.id }}).then((data1) => {
                OTPLog.update({is_verified : 2},{ where: {  user_email: param.email,
                    otp: param.otp,
                    is_verified: true }}).then((data1) => {
                return res.send(success("Password changed successfully!"))

            }).catch(async (e) => {
                console.log(e, "ddd")
                return res.send(error(CONSTANT.SQL_ERROR))
            })
            }).catch(async (e) => {
                console.log(e, "ddd")
                return res.send(error(CONSTANT.SQL_ERROR))
            })
            
        }).catch(e => {
            console.log(e, "1")
            return res.send(error(CONSTANT.SQL_ERROR))
        })
            }).catch(async (e) => {
                console.log(e, "2")
                return res.send(error(CONSTANT.SQL_ERROR))
            })
        } else {
            return res.send(error("Invalid request!"))
        }
    }).catch(async (e) => {
        console.log(e,"3")
        return res.send(error(CONSTANT.SQL_ERROR))
    })   
    } catch (e) {
        console.log(e,"4")
        return res.send(error(CONSTANT.SERVER_ERROR))
    }
}

