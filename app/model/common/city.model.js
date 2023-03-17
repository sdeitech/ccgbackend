module.exports = (sequelize, Sequelize) => {
    const Cities = sequelize.define('cities', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            notEmpty: true,
        },
        state_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
        tableName: 'cities'
    });

    return Cities;
}