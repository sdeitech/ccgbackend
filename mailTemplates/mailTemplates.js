const config = require("../config/config").get(process.env.NODE_ENV || "local");



export const forgetEmail = async(APP, PORTS, token)=>
{

   
    
  let text = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dock Nock Email Template</title>
    
        <style>
            @media (max-width: 576px){
                section{
                    width: auto !important;
                }
                .box{
                    max-width: none !important;
                    width: 100% !important;
                }
                .innerBox{
                    max-width: 255px !important;
                }
            }
        </style>
    </head>
    <body style="background-color: #F9F9F9; width: 100% !important; height: 100vh; margin: 0; padding: 0;">
        <section style="border-right: 1px solid #DDDDDD; border-left: 1px solid #DDDDDD; width: 500px;  height: 100vh; margin: auto;">
            <div class="box" style="max-width: 500px; margin: 0 auto; background-color: #F9F9F9;">
                <div style="width: 100%; padding-top: 10px; text-align: center; position: relative; padding-bottom: 185px; height: 100%; background-image: url(${PORTS.APIHOST}:${PORTS.API_PORT}/public/upload/welcome_bg.png); background-repeat: no-repeat; background-size: cover;" >
                    <div>
                        <div>
                            <img src="${PORTS.API_HOST}:${PORTS.API_PORT}/public/upload/login.png" style="margin-bottom: 20px; width: 85px; margin-top: 20px;" alt="Logo">
                        </div>
                    </div>
        
                    <div class="innerBox" style="max-width: 300px; width: 100%; margin: auto; background-color: #fff; border-radius: 10px; padding: 20px; position: absolute; left: 50%; transform: translateX(-50%);     bottom: -200px;">
                        <h1 style="font-size: 32px; color: #272727; font-weight: 600; margin-top: 0; margin-bottom: 0;">Reset Password!</h1>
                        <p style="font-size: 15px; font-weight: 300; color: #656565; margin-top: 25px;">Here are the link below to reset the password.</p>
                        
                        <a href="${PORTS.API_HOST}" style="background-color: #64BD05; text-align: center; display: inline-block; padding: 8px 0px; max-width: 150px; width: 100%; font-size: 14px; font-weight: 300; margin: 15px  auto 0; color: #fff; border-radius: 35px; text-decoration: none;">Reset Password</a>
        
                        <p style="font-size: 15px; font-weight: 300; color: #656565; text-align: left; margin-top: 35px;">If you have any questions, just reply to this email - we're always happy to help out.</p>
        
                        <p style="font-size: 15px; font-weight: 300; color: #656565; text-align: left;margin-top: 25px;">Thanks,<span style="display: block;">Care Communication.</span></p>
                    </div>
                </div>
            </div>
        </section>
    </body>
    </html>`;

  return text;
}