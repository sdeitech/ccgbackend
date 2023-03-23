const md5 = require('md5')
const moment = require('moment')

module.exports = (sequelize, Sequelize) => {
    const Supplier = sequelize.define('supplier', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        
        // client_id: {
        //     type: Sequelize.STRING,
        //     notEmpty : true,
        //     allowNull: false,
        //     defaultValue: '0',
        //     validate: {
        //         notEmpty: {
        //             msg: "Client ID is required!"
        //         }
        //     },  
        // },



        supplier_name: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Supplier name is required!"
                }
            }
        },   
        
        contact_name:{
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Contact name is required!"
                }
            }
        },
        phone_number:{
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Phone number is required"
                }
            }
        },

       
        email: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Email is required"
                }
            }
        },

        street_address: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Email is required"
                }
            }
            
            // validate: {
            //     notEmpty: {
            //         msg: "Client ID is required!"
            //     }
            // },  
        },

        suburb: {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            
            validate: {
                notEmpty: {
                    msg: "Subrub is required!"
                }
            },  
        },

        postal_code: {
            type: Sequelize.INTEGER,
            notEmpty : true,
            allowNull: false,
            
            validate: {
                notEmpty: {
                    msg: "Postal is required!"
                }
            },  
        },

        notes: {
            type: Sequelize.STRING,
            notEmpty : false,
            allowNull: true,
            
          
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
    }, 
    {
        paranoid: true,
        // hooks: {
        //     beforeCreate: async (client) => {
        //         client.hashcode = await md5(new Date().getTime())
        //     }
        // },
        underscored: true,
        createdAt: "created_on",
        updatedAt: "updated_on",
        deletedAt: "deleted_on"
    })

    return Supplier
}