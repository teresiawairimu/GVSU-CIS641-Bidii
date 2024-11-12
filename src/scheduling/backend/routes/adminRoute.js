const express = require('express');
const router = express.Router();
const {
    createAdmin,
    modifyAdmin,
    deleteAdmin,
} = require('../controllers/adminController');
const {verifyFirebaseToken} = require('../middleware');

router.post('/create', createAdmin);
router.put('/modify', verifyFirebaseToken, modifyAdmin);
router.delete('/delete', verifyFirebaseToken, deleteAdmin);


module.exports = router;