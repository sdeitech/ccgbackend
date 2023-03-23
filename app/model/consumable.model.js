const md5 = require('md5')
const moment = require('moment')

module.exports = (sequelize, Sequelize) => {
    const Comsumable = sequelize.define('consumable', {
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



        item_name: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Item name is required!"
                }
            }
        },   
        
        quoted_price:{
            type: Sequelize.INTEGER,
            validate: {
                notEmpty: {
                    msg: "Quoted price is required"
                }
            }
        },
        supplier_price:{
            type: Sequelize.INTEGER,
            validate: {
                notEmpty: {
                    msg: "Supplier price is required"
                }
            }
        },

       
        margin_amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        },

        profit_amount: {
            type: Sequelize.INTEGER,
            notEmpty : true,
            allowNull: false,
            
            // validate: {
            //     notEmpty: {
            //         msg: "Client ID is required!"
            //     }
            // },  
        },

        supplier: {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            
            validate: {
                notEmpty: {
                    msg: "Supplier is required!"
                }
            },  
        },

        client_name: {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            
            validate: {
                notEmpty: {
                    msg: "Client Name is required!"
                }
            },  
        },

        cleaner_name: {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            
            validate: {
                notEmpty: {
                    msg: "Cleaner Name is required!"
                }
            },  
        },

        quantity: {
            type: Sequelize.INTEGER,
            notEmpty : true,
            allowNull: false,
            
            // validate: {
            //     notEmpty: {
            //         msg: "Client ID is required!"
            //     }
            // },  
        },

        date_stock_order:{
            type: Sequelize.DATE,
            validate: {
                notEmpty: {
                    msg: "Date is required"
                }
            }
        },

        date_stock_received:{
            type: Sequelize.DATE,
            validate: {
                notEmpty: {
                    msg: "Date is required"
                }
            }
        },

        invoice_status:{
            type    :Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Invoice Status is required"
                }
            }

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

    return Comsumable
}