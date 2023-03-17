const md5 = require('md5');
const moment = require('moment');

module.exports = (sequelize, Sequelize) => {
    const OTPLog = sequelize.define('otp_log', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },    
        otp : {
            type: Sequelize.INTEGER,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "OTP is required!"
                }
            },
        },
        is_verified : {
            type: Sequelize.BOOLEAN,
            notEmpty : true,
            defaultValue: false,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Verification status is required!"
                }
            },
        },
        user_email: {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "User email ID is required!"
                },
                isEmail: {
                    msg: "User email address must be valid!"
                }
            },
        },
        email_response : {
            type: Sequelize.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        log_type : {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        created_by : {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        updated_by : {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        created_on: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue : null,
            get() {
                return moment(this.getDataValue('created_on')).format('DD-MM-YYYY h:mm:ss');
            }
        },
        updated_on: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue : null,
            get() {
                return moment(this.getDataValue('updated_on')).format('DD-MM-YYYY h:mm:ss');
            }
        }
    }, {
        underscored: true,
        createdAt: "created_on",
        updatedAt: "updated_on",
    });

    return OTPLog;
}