require('dotenv').config()
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const https = require('https');
const fs = require('fs');
const db = require('./app/config/db.config');
const {superAdminEntry} = require('./app/controller/common.controller')
const env = process.env

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 500000 }));

global.__basedir = __dirname;

const { jwt, errorHandler, sessionChecker } = require('./app/utils/jwt');

global.s3 = new AWS.S3({
    accessKeyId: (typeof env.S3KEY != 'undefined' && env.S3KEY != '' && env.S3KEY != null) ? env.S3KEY : '',
    secretAccessKey: (typeof env.S3SECRET != 'undefined' && env.S3SECRET != '' && env.S3SECRET != null) ? env.S3SECRET : '',
    region: (typeof env.S3REGION != 'undefined' && env.S3REGION != '' && env.S3REGION != null) ? env.S3REGION : '',
});

if (!s3.headBucket(env.bucketName)) {
    var bucketPromise = s3.createBucket({ Bucket: env.bucketName }).promise();
}

//{force: true, alter: true}
db.sequelize.sync({alter: false}).then(() => {
    console.log('DB migrated...');
    superAdminEntry()
});
// app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.static('public'));

if(!fs.existsSync(path.join(__dirname, 'public')))
    fs.mkdirSync(path.join(__dirname, 'public'))

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

require('./app/route')(app);

let server = app.listen(env.PORT, '0.0.0.0', function() {
    let host = server.address().address
    let port = server.address().port
    console.log("App listening at http://%s:%s", host, port)
});

// module.exports = app;

//?? to check
// 

//?? to do 
// 1. remove unnecessary is_active from all apis
// 1.1 cleaners
// 2 change all static CONSTANTS & SETTING object values to {key:"", value:""} format
// 3. findAll 
//      3.1 where : object{} to array conversion : DONE
//      3.2 check all fields from UI and then sent them back

//?? to ask
// 