const express = require('express');
const router = express.Router();
const {
    createUser,
    retrieveProfileById,
    retrieveProfile,
    modifyUser,
    deleteUser,
} = require('../controllers/userController');
const {verifyFirebaseToken} = require('../middleware');

router.post('/', verifyFirebaseToken, createUser);
router.get('/', verifyFirebaseToken, retrieveProfile);
router.get('/:id', verifyFirebaseToken, retrieveProfileById);
router.put('/:id', verifyFirebaseToken, modifyUser);
router.delete('/:id', verifyFirebaseToken, deleteUser);

module.exports = router;