const multer = require('multer');

// je déclarer les MIME_TYPES autorisés
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({

    // indique à multer où se trouve le dossier pour stocker l'image
    destination: (req, file, callback) => {

        callback(null, 'images');

    },
    filename: (req, file, callback) => {

        // on récupère le filename original
        const name = file.originalname.split(' ').join('_');

        // récupère l'extension
        const extension = MIME_TYPES[file.mimetype];

        // retourne le nom du fichier avec la date actuelle en milliseconde
        callback(null, name + Date.now() + '.' + extension);

    }

});

module.exports = multer({storage: storage} ).single('image');