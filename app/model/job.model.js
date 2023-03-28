// const md5 = require('md5')
const md5=require('md5')
const moment = require('moment')

module.exports = (sequelize, Sequelize) => {
    const Job = sequelize.define('job', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        // hashcode: {
        //     type: Sequelize.STRING,
        //     notEmpty: true,
        // },
     
        job_id: {
            type: Sequelize.STRING,
            notEmpty : true,
            allowNull: false,
            defaultValue: '0',
            validate: {
                notEmpty: {
                    msg: "Job ID is required!"
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
        site_address: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Site Address is required!"
                }
            }
        },

        cleaning_type: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Site Address is required!"
                }
            }
        },
        schedule_date:{
            type: Sequelize.DATE,
            validate: {
                notEmpty: {
                    msg: "schedule date is required"
                }
            }
        },

        cleaner_assign: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Cleaner Assign is required!"
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
        // hooks: {
        //     beforeCreate: async (job) => {
        //         job.hashcode = await md5(new Date().getTime())
        //     }
        // },
        underscored: true,
        createdAt: "created_on",
        updatedAt: "updated_on",
        deletedAt: "deleted_on"
    })

    return Job
}