import Admin from "../models/Admin.js";
import { cryptPassword } from "../crypte_mdp/cryptPassword.js";
import { comparePassword } from "../crypte_mdp/cryptPassword.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // Retourne le chemin absolu du fichier en cours
const __dirname = path.dirname(__filename); // Retourne le chemin absolu de la racine du projet

//------------------------------VERIFICATION-FORMULAIRE-D'INSCRIPTION------------------------------------------------------------
export class AdminController {
    static async subscribe(admin) {
        let objerror = {
            errors: [],
        };
        let adminSaved = null;
        if (admin.password != admin.confirmpassword) {
            objerror.errors.push("le mot de passe n'est pas le meme");
            return objerror;
        }
        admin.password = await cryptPassword(admin.password); // Je crypte le mdp de l'admin avant de l'inséré en base page utilisé (cryptPassword.js)
        const newAdmin = new Admin(admin);
        let err = newAdmin.validateSync(); // Cette méthode retourne une erreur si notre objet n'est pas conforme au (Admin.js models)
        if (err) {
            for (let i = 0; i < Object.values(err.errors).length; i++) {
                // Je parcours les erreurs
                objerror.errors.push(Object.values(err.errors)[i].message);
                // Je les inseres dans mon tableau d'erreur
            }
            return objerror; // Je retourne mon tableau d'erreur si il y en as
        }

        let findAdmin = await Admin.findOne({ email: admin.email }); //({ mailAdmin: admin.email }) // Je verifie si admin avec le meme mail existe en base

        if (!findAdmin) {
            // Si aucun admin en base
            adminSaved = await newAdmin.save(); //je l'insere en base
            return adminSaved;
        } else {
            // Si il y en a un en base
            objerror.errors.push("Ce mail à deja été utilisé"); //j'insere une erreur dans mon tableau d'erreur
            return objerror; // et je retourne mon tableau d'erreur
        }
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------
    static async getAdmin() {
        return await Admin.find();
    }
    static async getAdmin(id, excludeFields) {
        return await Admin.findOne({ _id: id }, excludeFields);
    }

    //------------------------------SUPPRIME-ADMIN------------------------------------
    static async deleteAdmin(id){
        return await Admin.deleteOne({ _id: id });
    }

    //------------------------------CONNEXION-ADMIN-----------------------------------
    static async login(body) {
        let objerror = {
            error: "",
        };
        let admin = await Admin.findOne({ emailAdmin: body.emailAdmin });
        if (admin) {
            let compare = await comparePassword(body.password, admin.password);
            if (compare) {
                return admin;
            } else {
                objerror.error = "Le mot de passe n'est pas valide";
                return objerror;
            }
        } else {
            objerror.error = "L'administrateur n'existe pas !";
            return objerror;
        }
    }
}
export default AdminController;
