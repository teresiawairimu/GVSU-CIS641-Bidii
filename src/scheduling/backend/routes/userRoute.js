const express = require('express');
const router = express.Router();
const {
    createUser,
    retrieveProfile,
    modifyUser,
    deleteUser,
} = require('../controllers/userController');
const {verifyFirebaseToken} = require('../middleware');

router.post('/', verifyFirebaseToken, createUser);
router.get('/', verifyFirebaseToken, retrieveProfile);
router.put('/:id', verifyFirebaseToken, modifyUser);
router.delete('/:id', verifyFirebaseToken, deleteUser);

module.exports = router;