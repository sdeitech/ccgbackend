const md5 = require('md5')
const moment = require('moment')

module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define('task', {
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



        task_name: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Task name is required!"
                }
            }
        },   
        
        start_date:{
            type: Sequelize.DATE,
            validate: {
                notEmpty: {
                    msg: "Start date is required"
                }
            }
        },
        end_date:{
            type: Sequelize.DATE,
            validate: {
                notEmpty: {
                    msg: "End date is required"
                }
            }
        },

        // task_status:{
        //     type    :Sequelize.BOOLEAN,
        //     defaultValue:false

        // },
        task_status: {
            type: Sequelize.TINYINT,
            allowNull: false,
            defaultValue: 1
        },

        assign_to: {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            
            validate: {
                notEmpty: {
                    msg: "Client ID is required!"
                }
            },  
        },

        task_description:{
            type    :Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Description is required"
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

    return Task
}