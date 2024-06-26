const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const Todo = require('./Todo')(sequelize);
const User = require('./User')(sequelize);
const Self = require('./Self')(sequelize);

sequelize.sync();

module.exports = { sequelize, Todo, User, Self };