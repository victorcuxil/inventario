const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAll, create, update, delete: deletePC, generatePDF } = require('../controllers/pcController');

router.get('/', auth, getAll);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, deletePC);
router.get('/reporte', auth, generatePDF);

module.exports = router;