const md5 = require('md5')
const moment = require('moment')

module.exports = (sequelize, Sequelize) => {
    const Cleaner = sequelize.define('cleaner', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        hashcode: {
            type: Sequelize.STRING,
            notEmpty: true,
        },      
        name: {
            type: Sequelize.STRING,
            // notEmpty: true,
            // validate: {
            //     notEmpty: {
            //         msg: "Cleaner name is required!"
            //     }
            // }
        },
        phone_no : {
            type: Sequelize.STRING,
            // notEmpty : true,
            // allowNull: true,
            // validate: {
            //     notEmpty: {
            //         msg: "Phone number is required!"
            //     }
            // },
        },
        email: {
            type: Sequelize.STRING,
            // notEmpty : true,
            // allowNull: false,
            // validate: {
            //     notEmpty: {
            //         msg: "Email ID is required!"
            //     },
            //     isEmail: {
            //         msg: "Email address must be valid!"
            //     }
            // },
        },
        contract_url: {
            type: Sequelize.STRING,
            // notEmpty: true,
            // validate: {
            //     notEmpty: {
            //         msg: "Contract URL is required!"
            //     }
            // }
        },
        insurance_url: {
            type: Sequelize.STRING,
            // notEmpty: true,
            // validate: {
            //     notEmpty: {
            //         msg: "Insurance URL is required!"
            //     }
            // }
        },
        insurance_expiry_date: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue : null,
            get() {
                return moment(this.getDataValue('deleted_on')).format('DD-MM-YYYY h:mm:ss')
            }
        },
        email_alert : {
            type: Sequelize.TINYINT,
            // notEmpty : true,
            // allowNull: false,
            // validate: {
            //     notEmpty: {
            //         msg: "Email Alert value is required!"
            //     }
            // },
        },
        address: {
            type: Sequelize.STRING,
            // notEmpty: true,
            // validate: {
            //     notEmpty: {
            //         msg: "Address is required!"
            //     }
            // }
        },
        suburb: {
            type: Sequelize.STRING,
            defaultValue : null
        },
        postal_code: {
            type: Sequelize.STRING,
            // notEmpty: true,
            // validate: {
            //     notEmpty: {
            //         msg: "Postal Code is required!"
            //     },
            // }
        },
        emergency_contact_name: {
            type: Sequelize.STRING,
            // notEmpty: true,
            // validate: {
            //     notEmpty: {
            //         msg: "Emergency contact name is required!"
            //     }
            // }
        },
        emergency_phone_no : {
            type: Sequelize.STRING,
            // notEmpty : true,
            // allowNull: false,
            // validate: {
            //     notEmpty: {
            //         msg: "Emergency contact number is required!"
            //     }
            // },
        },
        notes: {
            type: Sequelize.TEXT,
            // notEmpty: true,
            // validate: {
            //     notEmpty: {
            //         msg: "Notes is required!"
            //     },
            // }
        },
        lead_id : {
            type: Sequelize.INTEGER,
            defaultValue: null,
        },
        job_id : {
            type: Sequelize.INTEGER,
            defaultValue: null,
        },
        travel_distance : {
            type: Sequelize.INTEGER,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Travel Distance is required!"
                }
            },
        },
        task_status: {
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
        hooks: {
            beforeCreate: async (cleaner) => {
                cleaner.hashcode = md5(new Date().getTime())
            }
        },
        paranoid: true,
        underscored: true,
        createdAt: "created_on",
        updatedAt: "updated_on",
        deletedAt: "deleted_on"
    })

    return Cleaner
}