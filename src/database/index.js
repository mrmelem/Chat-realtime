const mongoose = require('mongoose')

class Connection {
    constructor() {
        this.mongoDB()
    }

    mongoDB() {
        mongoose.connect("mongodb://localhost/nodejs", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
            useCreateIndex: true
        })
            .then(() => {
                console.log("[MongoDB] Connection")
            })
            .catch((error) => {
                console.log(`[MongoDB] error -> ${error}`)
            })
    }
}


module.exports = new Connection();