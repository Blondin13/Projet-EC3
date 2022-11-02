import mongoose from "mongoose"
const userSchema = new mongoose.Schema({

//-------------------------------------------FORMULAIRE DE L'INSCRIPTION--------------------------------------------------------------------
    ciename: {
        type: String,
        required: [true, "Manque nom d'entreprise"],
    },
    name: {
        type: String,
        required: [true, 'Manque nom'],
    },
    firstname: {
        type: String,
        required: [true, 'Manque prénom'],
    },
    fonctionname: {
        type: String,
        required: [true, 'Manque fonction'],
    },
    email: {
        type: String,
        required: [true, 'Manque votre mail'],
    },
    password: {
        type: String,
        required: [true, 'Manque mot de passe']
    },
    
//------------------------------------------------FORMULAIRE ADRESSE------------------------------------------------------------------------
    ndevoie: {
        type: Number,
    },
    tdevoie: {
        type: String,
    },
    voiename: {
        type: String,
    },
    complementad: {
        type: String,
    },
    codepostal: {
        type: Number,
    },
    latitude:{
        type: Number,
    },
    longitude:{
        type: Number,
    },
    ville: {
        type: String,
    },
    pays: {
        type: String,
    },
    ndesiret: {
        type: Number,
    },
    ndetel: {
        type: Number,
    },
    ldirect: {
        type: Number,
    },
    besoins: {
        type: String,
    },
    productions: {
        type: String,
    },
    dechets: {
        type: String,
    },
    logo: {
        type: String,
    },
})

const User = mongoose.model('User', userSchema)
export default User

