const express = require('express');
const router = express.Router();
const {
    retrieveService,
    retrieveServiceById,
} = require('../controllers/serviceController')

const { verifyFirebaseToken } = require('../middleware');


router.get('/', verifyFirebaseToken, retrieveService);
router.get('/:id', verifyFirebaseToken, retrieveServiceById);

module.exports = router;


