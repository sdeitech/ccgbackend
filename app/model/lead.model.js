const md5 = require('md5');
const moment = require('moment');

module.exports = (sequelize, Sequelize) => {
    const Lead = sequelize.define('lead', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        hashcode: {
            type: Sequelize.STRING,
            notEmpty: true,
        },      
        lead_id: {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            defaultValue: '0',
            validate: {
                notEmpty: {
                    msg: "Lead ID is required!"
                }
            },  
        },
        client_name: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Client name is required!"
                }
            }
        },
        organisation : {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Organisation is required!"
                }
            },
        },
        lead_status : {
            type: Sequelize.INTEGER,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Lead status is required!"
                }
            },
        },
        client_email: {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Email ID is required!"
                },
                isEmail: {
                    msg: "Email address must be valid!"
                }
            },
        },
        phone_no : {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Phone number is required!"
                }
            },
        },
        website : {
            type: Sequelize.STRING,
            defaultValue: null
        },
        industry_id : {
            type: Sequelize.INTEGER,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Country is required!"
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
        staff_id : {
            type: Sequelize.INTEGER,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Staff is required!"
                }
            },
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        },
        address: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Address is required!"
                }
            }
        },
        suburb: {
            type: Sequelize.STRING,
            defaultValue : null
        },
        postal_code: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Postal Code is required!"
                },
            }
        },
        notes: {
            type: Sequelize.TEXT,
            allowNull: true,
            defaultValue: null
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
                return moment(this.getDataValue('deleted_on')).format('DD-MM-YYYY h:mm:ss');
            }
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
        hooks: {
            beforeCreate: async (lead) => {
                lead.hashcode = await md5(new Date().getTime());
            }
        },
        paranoid: true,
        underscored: true,
        createdAt: "created_on",
        updatedAt: "updated_on",
        deletedAt: "deleted_on"
    });

    return Lead;
}