import mongoose from "mongoose";
import 'dotenv/config';
process.env.NODE_ENV = process.env.NODE_ENV || "local"; //local

const config = require("../config/config.js").get(process.env.NODE_ENV);

const { DB } = config;
var options = {
    user: DB.UserName,
    pass: DB.Password,
};

const MONGOURI = `mongodb://${DB.HOST}:${DB.PORT}/${DB.DATABASE}`;

const InitiateMongoServer = async () => {
    try {
        console.log(MONGOURI);
        await mongoose.connect(MONGOURI, options);
        console.log("Connected to DB !!");
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = InitiateMongoServer;