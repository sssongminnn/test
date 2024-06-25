const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Self', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        company: {
            type: DataTypes.STRING,
            allowNull: false
        },
        questionNumber: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false
        },
        answer: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });
};
