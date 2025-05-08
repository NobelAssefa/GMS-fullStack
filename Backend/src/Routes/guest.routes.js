const express = require('express');
const router = express.Router();
const { createGuest, getGuests, getSingleGuest, updateGuest, deleteGuest } = require('../Controller/Guest.controller');
const {authMiddleware,is_Admin} = require('../Middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/createguest',createGuest);
router.get('/getguests', getGuests);
router.get('/getguest/:id',getSingleGuest);
router.put('/updateguest/:id',updateGuest);
router.put('/deleteguest/:id',deleteGuest);

module.exports = router;