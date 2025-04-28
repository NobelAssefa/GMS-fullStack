const express = require('express')
const router = express.Router();
const { createCar, getCar, getSingleCar, updateCar, deleteCar } = require('../Controller/car.controller');
const {authMiddleware,is_Admin} = require('../Middlewares/authMiddleware');

router.use(authMiddleware);


router.post('/createcar',createCar)
router.get('/getcars',getCar)
router.get('/getsinglecar/:id',getSingleCar);
router.put('/updatecar/:id',updateCar)
router.put('/deletecar/:id',deleteCar)


module.exports = router;