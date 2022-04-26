import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import nodemailer from "nodemailer";
import Config from "./Config.js";
import User from "./models/User.js";
import groot from "./authGuard/authGuard.js";
import UserController from "./controllers/User.js";
const db = `mongodb+srv://cc:${Config.mdpBDD}@eccc.0fr40.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//----------------------------------DEMARAGE-DU-SERVER----------------------------------------------------------------------
const app = express(); // Crée une constante de l'application express
app.use(session({ secret: "ssh", saveUninitialized: true, resave: true }));
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.listen(8024, () => { // Ecoute sur le port 8024
console.log("Server a démarer dans http://localhost:8024"); // Renvoi le message "Server a démarer dans http://localhost:8024"
});

//-------------------------------CONNEXION-BASE-DE-DONNEES------------------------------------------------------------------
mongoose.connect(db, (err) => {
    if(err){
        console.error("error" + err);        // Si il y as une erreur on renvoie le msg d'erreur sur le terminal
    }else{
        console.log("connected at mongoDb"); // Sinon on renvoie le msg "connected at mongoDb" sur le terminal
    }
});

//-------------------------------CONNEXION-A-LA-BOITE-MAIL------------------------------------------------------------------
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth:{
        type: "login",        // Default
        user: Config.mail,    // Je recupére le Config.mail créé dans mon fichier Config.js
        pass: Config.mdpMail, // Je recupére le Config.mdpMail créé dans mon fichier Config.js
    },                        // Config.js et créé pour pouvoir cacher le mail et le mdp
});

//---------------------FORMULAIRE-CONTACT-VISITOR-AVEC-L'ENVOIE-DU-MESSAGE---------------------------------------------------------
app.post("/contact", async (req, res) => {
    let message = "";
    let mailOptions = {
        from: req.body.email,
        to: "c.au.carre.ri7@gmail.com",
        subject: `demande de contact de ${req.body.fisrtname} ${req.body.email} ${req.body.sujet}`,
        text: req.body.message,
    };

    transporter.sendMail(mailOptions, (err) => {
        if(err){ // Si il y as une erreur on renvoie le msg "Votre message n'est pas transmis !" sur le formulaire
            message = "Votre message n'est pas transmis !";
            console.log(err);
            res.render("pages-visitors/contact.html.twig", { message });
        }else{   // Sinon on renvoie le msg "Votre message est transmis !" sur le formulaire
            message = "Votre message est transmis !";
            res.render("pages-visitors/contact.html.twig", { message });
                // On reste sur la page contact du mode visiteur
        }
    });         
});

//---------------------FORMULAIRE-CONTACT-USER-AVEC-L'ENVOIE-DU-MESSAGE---------------------------------------------------------
app.post("/contact-user/:id", groot, async (req, res) => {
    let message = "";
    let mailOptions = {
        from: req.body.email,
        to: "c.au.carre.ri7@gmail.com",
        subject: `demande de contact de ${req.body.fisrtname} ${req.body.email} ${req.body.sujet}`,
        text: req.body.message,
    };

    transporter.sendMail(mailOptions, (err) => {
        if(err){ // Si il y as une erreur on renvoie le msg "Votre message n'est pas transmis !" sur le formulaire
            message = "Votre message n'est pas transmis !";
            console.log(err);
            res.render("pages-users/contact-user.html.twig", { message });
        }else{   // Sinon on renvoie le msg "Votre message est transmis !" sur le formulaire
            message = "Votre message est transmis !";
            res.render("pages-users/contact-user.html.twig", { message });
            
                // On reste sur la page contact du mode visiteur
        }
    });  // * Ne fonstionne pas demander a Thomas si jai bien fait URGENT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
});

//---------------------------------ROUTE-MODE-VISITEUR--------------------------------------------------------------------
//---------------------------------------INDEX------------------------------------------------
app.get("/", async (req, res) => {
    res.render("pages-visitors/index.html.twig");
});

//--------------------------------------CONTACT-----------------------------------------------
app.get("/contact", async (req, res) => {
    res.render("pages-visitors/contact.html.twig", {
        page: "contact",
        user: req.session.user,
    });
});

//-------------------------------------CONNEXION----------------------------------------------
app.get("/connexion", async (req, res) => {
    res.render("pages-visitors/connexion.html.twig");
});

app.post("/connexion", async (req, res) => {
    let user = await UserController.login(req.body);
    if (user.error) {
        res.render("pages-visitors/connexion.html.twig", {
            error: user.error,
        });
    } else {
        req.session.userId = user._id;
        res.redirect("/accueil/");
    }
});

//-------------------------------------INSCRIPTION--------------------------------------------
app.get("/sinscrire", async (req, res) => {
    res.render("pages-visitors/sinscrire.html.twig");
});

app.post("/sinscrire", async (req, res) => {
    let user = await UserController.subscribe(req.body);
    if (user.errors) {
        res.render("pages-visitors/sinscrire.html.twig", {
            errors: user.errors,
        });
    } else {
        req.session.userId = user._id;
        res.redirect("/mon-profil/" + req.session.userId);
    }
});

//------------------------------------ROUTE-MODE-USERS--------------------------------------------------------------------
//----------------------------------------ACCUEIL----------------------------------------------
app.get("/accueil/", groot, async (req, res) => {
    res.render("pages-users/accueil.html.twig", {
        user: req.session.user,
    });
});

//---------------------------------------ENTREPRISE--------------------------------------------
app.get("/entreprises/:id", groot, async (req, res) => {
    let cards = await User.find();
    res.render("pages-users/entreprises.html.twig", {
        user: req.session.user,
        cards: cards,
    });
});    // Méthodes FICHE-COMPLETE et API

//----------------------------------------RECHERCHE--------------------------------------------
app.get("/recherche/:id", groot, async (req, res) => {
    res.render("pages-users/recherche.html.twig", {
        user: req.session.user,
    });
});

//---------------------------------------CONTACT-USER------------------------------------------
app.get("/contact-user/:id", groot, async (req, res) => {
    res.render("pages-users/contact-user.html.twig", {
        user: req.session.user,
    });
});

//----------------------------------------MON-PROFIL-------------------------------------------
app.get("/mon-profil/:id", groot, async (req, res) => {
    res.render("pages-users/mon-profil.html.twig", {
        user: req.session.user,
    });
});

app.post("/mon-profil/:id", groot, async (req, res) => {
    let user = await UserController.updateUser(req.session.userId, req.body);
    if (user.modifiedCount == 1) {
        res.redirect("/besoins/" + req.session.userId);
    }else{
        res.redirect("/mon-profil/" + req.session.userId);
    }
});

app.get("/supprime-compte/:id", groot, async (req, res) => {
    res.render("pages-users/supprime-compte.html.twig", {
        user: req.session.user,
    });
});

app.post("/supprime-compte/:id", groot, async (req, res) => {
    await User.deleteOne({ _id: req.params.id})
    req.session.destroy();
    res.redirect("/");
});

app.get("/deconnexion", groot, async (req, res) => {
    req.session.destroy();
    res.redirect("/");
});



//------------------------------------------BESOINS-----------------------------------------
app.get("/besoins/:id", groot, async (req, res) => {
    res.render("pages-users/besoins.html.twig", {
        user: req.session.user,
        step: "entreprises",
        nextStep: "productions",
    });
});

app.post("/besoins/:id", groot, async (req, res) => {
    res.render("pages-users/besoins.html.twig", {
        user: req.session.user,
        step: "entreprises",
        nextStep: "productions",
    });
});

app.post("/besoins/:id/:nextStep", groot, async (req, res) => {
    console.log(req.body);
    let user = await UserController.updateUser(req.session.userId, req.body);
    res.redirect(`/${req.params.nextStep}/${req.session.userId}`);
});

app.post("/besoins/:id/:step", groot, async (req, res) => {
    console.log(req.body);
    let user = await UserController.updateUser(req.session.userId, req.body);
    res.redirect(`/${req.params.step}/${req.session.userId}`);
});

//------------------------------------------PRODUCTIONS---------------------------------------------
app.get("/productions/:id", groot, async (req, res) => {
    res.render("pages-users/productions.html.twig", {
        user: req.session.user,
        step: "entreprises",
        nextStep: "dechets",
    });
});

app.post("/productions/:id", groot, async (req, res) => {
    res.render("pages-users/productions.html.twig", {
        user: req.session.user,
        step: "entreprises",
        nextStep: "dechets",
    });
});

app.post("/productions/:id/:nextStep", groot, async (req, res) => {
    let user = await UserController.updateUser(req.session.userId, req.body);
    res.redirect(`/${req.params.nextStep}/${req.session.userId}`);
});

app.post("/productions/:id/:step", groot, async (req, res) => {
    let user = await UserController.updateUser(req.session.userId, req.body);
    res.redirect(`/${req.params.step}/${req.session.userId}`);
});

//--------------------------------------------DECHETS------------------------------------------------
app.get("/dechets/:id", groot, async (req, res) => {
    res.render("pages-users/dechets.html.twig", {
        user: req.session.user,
        step: "entreprises",
    });
});

app.post("/dechets/:id", groot, async (req, res) => {
    res.render("pages-users/dechets.html.twig", {
        user: req.session.user,
        step: "entreprises",
    });
});

app.post("/dechets/:id/:step", groot, async (req, res) => {
    let user = await UserController.updateUser(req.session.userId, req.body);
    res.redirect(`/${req.params.step}/${req.session.userId}`);
});

//-----------------------------------RENDU-CARD-COMPLETE---------------------------------------------

app.get("/card-complete/:id", groot, async (req, res) => {
    let card = await User.findOne({_id: req.params.id});
    res.render("pages-users/fiche-complete.html.twig", {
        user: req.session.user,
        card: card,
    });
});

//----------------------------------------------API--------------------------------------------------
app.get("/test", groot, async (req, res) => {
    let user = req.session.user;
    let test = await fetch(
        `http://api.positionstack.com/v1/forward?access_key=${Config.ApiKey}&query=${user.ndevoie}-${user.tdevoie}-${user.voiename}-${user.complementad}-${user.codepostal}-${user.ville}-${user.pays}`
    );
    test = await test.json();
});
