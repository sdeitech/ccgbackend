const md5 = require('md5')
const moment = require('moment')

module.exports = (sequelize, Sequelize) => {
    const Work = sequelize.define('work', {
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


        cleanerId: {
            type: Sequelize.INTEGER,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Cleaner is required!"
                }
            }
        },  


        lead_id: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Lead Id is required!"
                }
            }
        },   
        
        Job_id:{
            type: Sequelize.INTEGER,
            validate: {
                notEmpty: {
                    msg: "Job Id is required"
                }
            }
        },
        client_name:{
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Client Name is required"
                }
            }
        },

        // task_status:{
        //     type    :Sequelize.BOOLEAN,
        //     defaultValue:false

        // },
        site_name: {
             type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Client Name is required"
                }
            }
        },
           
    

        city: {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            
            validate: {
                notEmpty: {
                    msg: "City is required!"
                }
            },  
        },

        task_schedule:{
            type    :Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Task Schedule is required"
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

    return Work
}