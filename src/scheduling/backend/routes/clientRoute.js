const express = require('express');
const router = express.Router();
const {
    createClient,
    retrieveProfile,
    modifyClient,
    deleteClient,
} = require('../controllers/clients');
const {verifyFirebaseToken} = require('../middleware');

router.post('/create', createClient);
router.get('/profiles', retrieveProfile);
router.put('/modify', verifyFirebaseToken, modifyClient);
router.delete('/delete', verifyFirebaseToken, deleteClient);
module.exports = router;