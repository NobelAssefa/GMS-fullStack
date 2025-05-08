const express = require('express');
const router = express.Router();
const {authMiddleware,is_Admin,authorize} = require('../Middlewares/authMiddleware');
const { createVisit, getVisits, approveVisit, checkInVisit, checkOutVisit, getVisitsByUserId } = require('../Controller/Visit.controller');


router.use(authMiddleware);
// router.use(authorize('SECRETARY','DIRECTOR', 'PRESIDENT', 'VP'))


router.post('/createvisit',createVisit);
router.get('/getvisits',getVisits)
router.get('/getvisitsByuserId/:userId',getVisitsByUserId)
router.post('/approvevisit',approveVisit)
router.post('/checkin',checkInVisit)
router.post('/checkout',checkOutVisit)

module.exports = router;