const Sequelize = require('sequelize')
const dbConfig = require('../config/mysql')
const sequelize = new Sequelize(dbConfig)


const Msg = sequelize.define('tb_api_messages', {
    ref: {
        type: Sequelize.STRING
    },
    path: {
        type: Sequelize.STRING
    },
    content: {
        type: Sequelize.TEXT
    }
})

module.exports = Msg