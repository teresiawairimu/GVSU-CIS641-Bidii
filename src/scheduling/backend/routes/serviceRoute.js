const express = require('express');
const router = express.Router();
const {
    retrieveService,
} = require('../controllers/serviceController')

const { verifyFirebaseToken } = require('../middleware');


router.get('/', verifyFirebaseToken, retrieveService);


module.exports = router;


