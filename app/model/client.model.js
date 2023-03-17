const md5 = require('md5')
const moment = require('moment')

module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define('client', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        hashcode: {
            type: Sequelize.STRING,
            notEmpty: true,
        },
        client_id: {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            defaultValue: '0',
            validate: {
                notEmpty: {
                    msg: "Client ID is required!"
                }
            },  
        },
        name: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Business name is required!"
                }
            }
        },   
        phone_no : {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Business phone number is required!"
                }
            },
        },   
        contact_name: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Contact Person's name is required!"
                }
            }
        },
        contact_email: {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Contact Person's email ID is required!"
                },
                isEmail: {
                    msg: "Email address must be valid!"
                }
            },
        },
        contact_phone_no : {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Contact Person's phone number is required!"
                }
            },
        },
        website : {
            type: Sequelize.STRING,
            notEmpty : false,
            allowNull: true,
        },
        industry_id : {
            type: Sequelize.INTEGER,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Industry is required!"
                }
            },
        },
        source_id : {
            type: Sequelize.INTEGER,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Source is required!"
                }
            },
        },
        comments : {
            type: Sequelize.TEXT,
            notEmpty : false,
            allowNull: true
        },
        is_active: {
            type: Sequelize.TINYINT,
            allowNull: false,
            defaultValue: 1
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
        deleted_by : {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        deleted_on: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue : null,
            get() {
                return moment(this.getDataValue('deleted_on')).format('DD-MM-YYYY h:mm:ss')
            }
        },
        created_on: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue : null,
            get() {
                return moment(this.getDataValue('created_on')).format('DD-MM-YYYY h:mm:ss')
            }
        },
        updated_on: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue : null,
            get() {
                return moment(this.getDataValue('updated_on')).format('DD-MM-YYYY h:mm:ss')
            }
        }
    }, {
        paranoid: true,
        hooks: {
            beforeCreate: async (client) => {
                client.hashcode = await md5(new Date().getTime())
            }
        },
        underscored: true,
        createdAt: "created_on",
        updatedAt: "updated_on",
        deletedAt: "deleted_on"
    })

    return Client
}