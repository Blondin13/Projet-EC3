import AdminController from "../controllers/Admin.js";

let grootAdmin = async (req, res, next) => { // C'est un middleware qui permettra de verifier si l'admin est connecté ou non
    let admin = await AdminController.getAdmin(req.session.adminId, { password: 0 });
    if(admin){
        req.session.admin = admin;
        next(); // Permet de passer au middleware suivant. en l'occurence dans ce projet, le corps de la route (middleware final)
    }else{
        res.redirect("/connexion-admin");
    }
};
export default grootAdmin;