import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({

//-------------------------------------------FORMULAIRE D'INSCRIPTION ADMIN--------------------------------------------------------------------

    nameAdmin: {
        type: String,
        required: [true, 'Manque nom'],
    },
    firstnameAdmin: {
        type: String,
        required: [true, 'Manque prénom'],
    },
    emailAdmin: {
        type: String,
        required: [true, 'Manque votre mail'],
    },
    password: {
        type: String,
        required: [true, 'Manque mot de passe']
    },
})

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;

