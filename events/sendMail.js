const event = require('events');
let evenement = new event.EventEmitter();

evenement.on('sendMail', function (params) {

    console.log("J'envoi un mail à " + params.email);

});

module.exports = evenement;