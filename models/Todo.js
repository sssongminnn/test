const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Todo', {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        tasks: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        done: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};