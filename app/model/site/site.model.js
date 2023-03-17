const md5 = require('md5');
const moment = require('moment');

module.exports = (sequelize, Sequelize) => {
    const Site = sequelize.define('site', {
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
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Site Name is required!"
                }
            }
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
            defaultValue: null
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
        phone_no: {
            type: Sequelize.STRING,
            notEmpty: true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Phone number is required!"
                }
            },
        },
        schedule_task: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Schedule task is required!"
                },
            }
        },
        frequency: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Frequency is required!"
                },
            }
        },
        investment: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Investment is required!"
                },
            }
        },
        weekly_quoted_price: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Weekly Quoted Price is required!"
                },
            }
        },
        cleaner_weekly_amount: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Cleaner's Weekly Amount is required!"
                },
            }
        },
        additional_weekly_cost: {
            type: Sequelize.STRING,
            allowNull: true
        },
        site_contract_url: {
            type: Sequelize.STRING,
            allowNull: true
        },
        cleaning_scope_url: {
            type: Sequelize.STRING,
            allowNull: true
        },
        recurring_clean: {
            type: Sequelize.INTEGER,
            notEmpty: true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Recurring Clean is required!"
                }
            },
        },
        days: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Days is required!"
                },
            }
        },
        start_time: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Start Time is required!"
                },
            }
        },
        finish_time: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Finish Time is required!"
                },
            }
        },
        alarm_code: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        key_types: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Key Type is required!"
                },
            }
        },
        total_keys: {
            type: Sequelize.INTEGER,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Total keys are required!"
                },
            }
        },
        notes: {
            type: Sequelize.TEXT,
            defaultValue: null
        },
        is_active: {
            type: Sequelize.TINYINT,
            allowNull: false,
            defaultValue: 1
        },
        created_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        updated_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        deleted_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        deleted_on: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
            get() {
                return moment(this.getDataValue('deleted_on')).format('DD-MM-YYYY h:mm:ss');
            }
        },
        created_on: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
            get() {
                return moment(this.getDataValue('created_on')).format('DD-MM-YYYY h:mm:ss');
            }
        },
        updated_on: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
            get() {
                return moment(this.getDataValue('updated_on')).format('DD-MM-YYYY h:mm:ss');
            }
        }
    }, {
        hooks: {
            beforeCreate: async (site) => {
                site.hashcode = await md5(new Date().getTime());
            }
        },
        paranoid: true,
        underscored: true,
        createdAt: "created_on",
        updatedAt: "updated_on",
        deletedAt: "deleted_on"
    });
    return Site;
}