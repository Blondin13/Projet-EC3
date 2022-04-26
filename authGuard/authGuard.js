import UserController from "../controllers/User.js";

let groot = async (req, res, next) => { // C'est un middleware qui permettra de verifier si l'utilisateur est connecté ou non
    let user = await UserController.getUser(req.session.userId, { password: 0 });
    if(user){
        req.session.user = user;
        next(); // Permet de passer au middleware suivant. en l'occurence dans ce projet, le corps de la route (middleware final)
    }else{
        res.redirect("/connexion");
    }
};
export default groot;
