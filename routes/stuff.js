const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/stuff');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

// GET
// Liste tous les objets
router.get('/', auth, stuffCtrl.getAllStuff);

// GET
// Récupère et retourne un objet
router.get('/:id', auth, stuffCtrl.getOneStuff);

// POST
// Ajoute l'objet en base de donnée
router.post('/', auth, multer, stuffCtrl.createStuff);

// PUT
// Récupère et modifie un objet
router.put('/:id', auth, multer, stuffCtrl.updateStuff);

// DELETE
// Supprime un objet de la base de donnée
router.delete('/:id', auth, stuffCtrl.deleteStuff);

module.exports = router;