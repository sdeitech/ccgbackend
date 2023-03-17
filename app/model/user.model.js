const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fname: {
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
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        hooks: {
            beforeCreate: async (user) => {
                user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(8));
            }
        }
    });

    return User;
}