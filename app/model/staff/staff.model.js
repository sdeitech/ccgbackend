const md5 = require('md5');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = (sequelize, Sequelize) => {
    const Staff = sequelize.define('staff', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        hashcode: {
            type: Sequelize.STRING,
            notEmpty: true,
        },      
        fname: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "First name is required!"
                }
            }
        },
        lname: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Last name is required!"
                }
            }
        },
        email: {
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
        gender : {
            type: Sequelize.INTEGER,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Gender is required!"
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
        role_id : {
            type: Sequelize.INTEGER,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Phone number is required!"
                }
            },
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
        password: {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty : {
                    msg : "Password is required!"
                },
                len: {
                    min : 8,
                    msg: "Password must be greater than 8 character!"
                }
            }
        },
        is_sub_admin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
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
        paranoid: true,
        hooks: {
            beforeCreate: async (staff) => {
                staff.hashcode = await md5(new Date().getTime());
                staff.password = await bcrypt.hash(staff.password, bcrypt.genSaltSync(8));
            }
        },
        underscored: true,
        createdAt: "created_on",
        updatedAt: "updated_on",
        deletedAt: "deleted_on"
    });

    return Staff;
}