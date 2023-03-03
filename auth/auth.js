import mongoose from "mongoose";
import express from "express";
import userSchema from "../models/user";
import responses from "../constants/constant";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {forgetEmail} from '../mailTemplates/mailTemplates'
import {sendEmail} from "../middlewares/sendEmails"
const config = require("../config/config").get(process.env.NODE_ENV);
const { SECRETKEY, APP, PORTS, API_PORT } = config;


export const login = async (req, res) => {
    try {
        let email = req.body.email;
        email = email.toLowerCase();
        let checkUser = await userSchema.findOne({
            email: email,
            status: { $ne: 2 }
        });
        if (!checkUser) {
            return res.json({
                status: responses.DATA_FAILED,
                messageID: responses.ALLREADY_EXIST,
                message: responses.USER_DOEST_NOT_EXIST,
            })
        } else {
            const isMatch = await bcrypt.compare(
                req.body.password,
                checkUser.password
            );
            if (!isMatch) {
                return res.jsonp({
                    status: responses.DATA_FAILED,
                    messageID: responses.ALLREADY_EXIST,
                    message: responses.INCORRECT_PASSWORD,
                });
            }
            const payload = {
                _id: checkUser.id,
                role: checkUser.role,
                name: checkUser.name,
                image: checkUser.image,
                email: checkUser.email,
            };
            const token = jwt.sign(
                payload,
                SECRETKEY,
                {
                    expiresIn: "72h",
                },
                async (err, token) => {
                    let data = {
                        role: checkUser.role,
                        token: token,
                        name: checkUser.name,
                        image: checkUser.image,
                        _id: checkUser._id,
                    };

                    res.status(200).json({
                        status: responses.SUCCESS,
                        messageID: responses.SUCCESS_CODE,
                        message: responses.LOGIN_SUCESS,
                        data: data,
                    });
                }
            );
        }


    } catch (err) {
        console.log(err)
    }
}


export const forgetPassword = async (req, res) => {
    try {
console.log(req.body, "check")
        const { email } = req.body
        let role = ''

        let existUser = await userSchema.findOne({ email: email, status: { $ne: 2 } })
       
        if (!existUser) {
            return res.json({
                status: responses.DATA_FAILED,
                messageID: responses.ALLREADY_EXIST,
                message: responses.USER_DOEST_NOT_EXIST,
            })

        }  
        if (existUser.status == 1 || existUser.status == 2) {
            return res.jsonp({
              status: responses.FAILURE,
              messageID: responses.ERROR_CODE,
              message:
              existUser.status == 0
                  ? "User cant reset Password under In-Active Mode"
                  : responses.USER_NOT_ACCESS_MSG,
            });
          }

            let payload = { type: role, _id: existUser._id };
         
            const token = jwt.sign(payload, SECRETKEY, { expiresIn: "20m" });
            await userSchema.findOneAndUpdate(
                { email: req.body.email },
                { $set: { token: token } },
                { new: true }
            );
                let dynamicURLData ;

            let ForgetPasswordMailContent = await forgetEmail(APP, PORTS, dynamicURLData)
               
            let subject = "Forgot Your Password";
            let text = ForgetPasswordMailContent
            let response = sendEmail(email, subject, text);

            if (response)
                return res.jsonp({
                    status: responses.SUCCESS,
                    messageID: responses.SUCCESS_CODE,
                    message: responses.FORGET_PASSWORD_MSG,
                    // url: `${APP.APIHOST}:${PORTS.EMAIL_PORT}/reset-password/${token}`,
                });
            else
                return res.jsonp({
                    status: responses.FAILURE,
                    messageID: responses.ERROR_CODE,
                    message: responses.PASSWORD_CHANGE_FAILED,
                });
        


    } catch (err) {

    }

}


