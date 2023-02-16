const bcrypt = require('bcrypt');
const User = require('../models/User');
const event = require('../events/sendMail');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {

            // création de l'user à partir du modèle User
            const user = new User({
                email: req.body.email,
                password: hash
            });

            // sauvegarde du user en bdd et envoi du status 201 + du message "Utiliseur créé !
            user.save()
                .then(() => {
                    res.status(201).json({ message: "Utilisateur créé !" })
                    event.emit('sendMail', { email: user.email});
                } )
                .catch(error => res.status(400).json({ error } ));

        })
        .catch(error => res.status(500).json({ error }))

}

exports.login = (req, res, next) => {

    // Récupérer l'user avec l'email envoyé par le front
    User.findOne({ email: req.body.email })
        .then(user => {

            // si l'user est vide
            if(!user){
                return res.status(401).json({ message: "Paire login/mot de passe incorrecte" });
            }

            // l'user est pas vide
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {

                    if(!valid){
                        return res.status(401).json({ message: "Paire login/mot de passe incorrecte" });
                    }

                    // si l'user est authentifié
                    res.status(200).json({

                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )

                    });

                })
                .catch(error => res.status(500).json({ error }))

        })
        .catch(error => res.status(400).json({ error }))

        // si l'user est vide  ===>   if(!user){ console.log("il n'existe pas") }
            // -> > console.log("c'est pas bon")
        // si l'user est pas vide

        // comparer le mdp crypté en BDD grâce à bcrypt avec le mdp de l'user <---- ???

            // si c'est pas bon
              // -> > console.log("c'est pas bon")

            // si c'est bon
                // -> console.log("c'est bon")


}