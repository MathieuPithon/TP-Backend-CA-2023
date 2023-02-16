const event = require('events');
const fs = require("fs");
let evenement = new event.EventEmitter();

evenement.on('creerFichier', function (params) {

    fs.writeFile('fichiers/' + params.fileName, params.message, err => {

        if(err){
            console.log(err);
        }

    })

});

evenement.on('appendFichier', function (params) {

    fs.appendFile('fichiers/' + params.fileName, params.message, err => {

        if(err){
            console.log(err);
        }

    })

});

module.exports = evenement;