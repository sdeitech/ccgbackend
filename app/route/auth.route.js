  const router = require("express").Router()
  const { validate } = require('../middlewares/validate')
  const authValidator = require('../validator/auth.validator')
  const auth = require('../controller/auth.controller')
  const { jwt, errorHandler } = require('../utils/jwt')
  
  //AUTH
  router.post('/login', validate(authValidator.login), auth.login)
  
  // Forgot Password
  router.post('/forgotpasswordemail', validate(authValidator.forgotPasswordEmail), auth.forgotPasswordEmail)
  router.post('/forgotpasswordOTPverify', validate(authValidator.forgotPasswordOTPVerify), auth.forgotPasswordOTPVerify)
  router.post('/forgotpasswordreset', validate(authValidator.forgotPasswordReset), auth.forgotPasswordReset)
  
  router.use(errorHandler)
  router.use(jwt)

  // Change Password
  router.post('/changepassword', validate(authValidator.changePassword), auth.changePassword)

  module.exports=router

