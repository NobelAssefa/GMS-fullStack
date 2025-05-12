const express = require('express');
const router = express.Router();
const {authMiddleware,is_Admin,authorize} = require('../Middlewares/authMiddleware');
const { createVisit, getVisits, approveVisit, checkInVisit, checkOutVisit, getVisitsByUserId,rejectVisit,getApprovedVisits } = require('../Controller/Visit.controller');

router.use(authMiddleware);

// Public routes (authenticated users)
router.post('/createvisit', createVisit);
router.get('/getvisits', getVisits);
router.get('/getvisitsbyuserid/:id', getVisitsByUserId);
router.get('/getapprovedvisits', getApprovedVisits);

// Routes that require SECRATORY role
router.put('/approvevisit/:id', authorize('SECRATORY'), approveVisit);
router.put('/rejectvisit/:id', authorize('SECRATORY'), rejectVisit);

// Routes that require SECURITY role
router.put('/checkinvisit/:unique_code', authorize('SECURITY'), checkInVisit);
router.put('/checkoutvisit/:unique_code', authorize('SECURITY'), checkOutVisit);

module.exports = router;