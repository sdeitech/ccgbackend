const md5 = require('md5');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('admin', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            notEmpty: true,
            validate: {
                notEmpty: {
                    msg: "Name is required!"
                }
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Email address must be valid!"
                }
            },
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: 3,
                    msg: "Password must be greater than 5 character!"
                }
            }
        },
        is_active: {
            type: Sequelize.TINYINT,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        hooks: {
            beforeCreate: async (user) => {
                user.hashcode = await md5(new Date().getTime());
            }
        },
        underscrored: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });

    return User;
}