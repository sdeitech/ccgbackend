module.exports = (sequelize, Sequelize) => {
    const Countries = sequelize.define('countries', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            notEmpty: true,
        },
        phonecode: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
        tableName: 'countries'
    });

    return Countries;
}