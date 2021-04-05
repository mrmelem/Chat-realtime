const Sequelize = require('sequelize')
const dbConfig = require('../config/mysql')
const sequelize = new Sequelize(dbConfig)


const User = sequelize.define('tb_api_users', {
    'username': {
        type: Sequelize.STRING
    },
    'ref': {
        type: Sequelize.STRING
    }
})

module.exports = User