const Thing = require("../models/Thing");
const fs = require('fs');
const worker = require('../workers/worker');
const event = require('../events/gestionFichier');

exports.getAllStuff = (req, res, next) => {

    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error } ))

}

exports.getOneStuff = (req, res, next) => {

    Thing.findById(req.params.id)
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(400).json({ error }))

}

exports.createStuff = (req, res, next) => {

    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    delete thingObject._userId;

    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })

    thing.save()
        .then(() => {

            // tache intensive
            console.log("C'est parti");

            worker('./workers/tache-intensive.js');

            console.log("C'est terminé !")

            res.status(201).json({ message: "Objet enregistré !!" })
        })
        .catch(error => res.status(400).json({ error } ));

}

exports.updateStuff = (req, res, next) => {

    // 1 - je récupère l'objet à partir du front
    const thingObject = req.file ? {
            ...JSON.parse(req.body.thing),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };

    delete thingObject._userId;

    // Etape 2 : récupérer l'objet en base
    Thing.findOne({_id: req.params.id})
        .then((thing) => {

            // Etape 3 : checker si l'objet en base est celui de l'user
            if(thing.userId !== req.auth.userId){
                res.status(401).json({message : 'Ce n\'est pas votre objet ! '})
            }else{

                // 4 - j'update mon objet
                Thing.updateOne({_id: req.params.id }, {...thingObject , _id: req.params.id } )
                    .then(() => {

                        event.emit('appendFichier', {fileName:'logModification.txt', message: `L'objet ${thing.title} a été modifié \n`} )

                        res.status(200).json({ message: "Objet modifié !" })

                    })
                    .catch(error => res.status(400).json({ error } ))

            }

        })
        .catch(error => res.status(400).json({ error } ));
}

exports.deleteStuff = (req, res, next) => {

    // Je récupère mon objet en base
    Thing.findOne({_id: req.params.id})
        .then((thing) => {

            // Je récupère le nom du fichier image
            const filename = thing.imageUrl.split('/images/')[1];

            // Je supprime l'image du serveur avec unlink
            fs.unlink(`images/${filename}`, (err) => {

                if(err) console.log(err);

                Thing.deleteOne( {_id: req.params.id })
                    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
                    .catch(error => res.status(400).json({ error } ))

            })

        })
        .catch(error => res.status(400).json({ error } ));


    /**/

}