const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Self', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });
};