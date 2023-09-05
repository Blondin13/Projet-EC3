import mongoose from "mongoose";
import User from "../models/User";
import UserController from "../controllers/User.js";
import Config from "../Config.js";
const db = `mongodb+srv://cc:${Config.mdpBDD}@eccc.0fr40.mongodb.net/bddtestEC3?retryWrites=true&w=majority`;


beforeEach(async () => {
    await User.deleteMany()
})

beforeAll(async () => {
    await mongoose.connect(db)
})

afterAll(async () => {
    setTimeout(async () => {
        await mongoose.connection.close()
    }, 1500)
})

describe("test de la fonction recuperation user",()=>{
    it("devrait retourner un tableau avec un utilisateur",async()=>{
       let userData = {
            ciename: "Ri7",
            name: "Will",
            firstname: "sauvage",
            fonctionname: "Directeur",
            tel: "0612345678",
            email: "ri7@gmail.com",
            password: "azerty"
       }
       let user = new User(userData)
       await user.save()
       let res = await UserController.getUsers()
       expect(res[0]._id).toEqual(user._id)
       expect(res[0].ciename).toEqual(user.ciename)
       expect(res[0].name).toEqual(user.name)
       expect(res[0].firstname).toEqual(user.firstname)
       expect(res[0].fonctionname).toEqual(user.fonctionname)
       expect(res[0].tel).toEqual(user.tel)
       expect(res[0].email).toEqual(user.email)
       expect(res[0].password).toEqual(user.password)
    })
})

describe("test de la fonction recuperation user",()=>{
    it("devrait retourner un tableau avec un utilisateur",async()=>{
       let userData = {
            ciename: "Ri7",
            name: "Will",
            firstname: "sauvage",
            fonctionname: "Directeur",
            tel: "0612345678",
            email: "ri7@gmail.com",
            password: "azerty"
       }
       let user = new User(userData)
       await user.save()
       let res = await UserController.getUser(user._id)

       expect(res._id).toEqual(user._id)
       expect(res.ciename).toEqual(user.ciename)
       expect(res.name).toEqual(user.name)
       expect(res.firstname).toEqual(user.firstname)
       expect(res.fonctionname).toEqual(user.fonctionname)
       expect(res.tel).toEqual(user.tel)
       expect(res.email).toEqual(user.email)
       expect(res.password).toEqual(user.password)


    })

    it("devrait retourner un tableau avec un utilisateur sans son mail",async()=>{
        let userData = {
             ciename: "Ri7",
             name: "Will",
             firstname: "sauvage",
             fonctionname: "Directeur",
             tel: "0612345678",
             email: "ri7@gmail.com",
             password: "azerty"
        }
        let user = new User(userData)
        await user.save()
        let res = await UserController.getUser(user._id,{ email: 0 })
        expect(res._id).toEqual(user._id)
        expect(res.email).not.toBeDefined()
 
     })
})