const express = require('express');
const router = express.Router();
const {
    createService,
    retrieveService,
    modifyService,
    deleteService,
} = require('../controllers/serviceController')

const { verifyFirebaseToken } = require('../middleware');

router.post('/create', createService);
router.get('/', retrieveService);
router.put('/modify:id', verifyFirebaseToken, modifyService);
router.delete('/delete:id', verifyFirebaseToken, deleteService);

module.exports = router;


