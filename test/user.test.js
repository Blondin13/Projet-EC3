const mongoose = require('mongoose');
const UserModel = require('../models/User');
const UserController = require("../controllers/User");
const Config = require('../Config')
const db = `mongodb+srv://cc:${Config.mdpBDD}@eccc.0fr40.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


beforeEach(async () => {
    await UserModel.deleteMany()
    await UserModel.deleteMany()
})

beforeAll(async () => {
    await mongoose.connect(db)
})

afterAll(async () => {
    setTimeout(async () => {
        await mongoose.connection.close()
    }, 1500)
})