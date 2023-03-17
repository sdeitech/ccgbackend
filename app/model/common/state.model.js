module.exports = (sequelize, Sequelize) => {
    const States = sequelize.define('states', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            notEmpty: true,
        },
        country_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
        tableName: 'states'
    });

    return States;
}