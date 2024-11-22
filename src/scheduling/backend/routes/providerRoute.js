const express = require('express');
const router = express.Router();
const {
    retrieveProvider,
} = require('../controllers/providerController')

const { verifyFirebaseToken } = require('../middleware');


router.get('/', verifyFirebaseToken, retrieveProvider);


module.exports = router;