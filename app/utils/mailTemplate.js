const mailTemplate = {
    forgotPasswordOTPMail: function (userName, hostURL, otp) {
        return new Promise(function (resolve, reject) {
            
            let data = "Your One Time Password is " + otp;
            resolve(data);
        });
    },


    signUpEmail: function (userName, hostURL, otp) {
        return new Promise(function (resolve, reject) {
            
            let data = "Your One Time Password is " + otp;
            resolve(data);
        });
    },
};

module.exports = mailTemplate;