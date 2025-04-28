const express = require('express');
const router = express.Router();
const {authMiddleware,is_Admin} = require('../Middlewares/authMiddleware');
const { createItem, getItemsByVisit, deleteItem, updateItem } = require('../Controller/Item.controller');
const { updateCar } = require('../Controller/car.controller');


router.use(authMiddleware);
router.post('/createitem',createItem);
router.get('/getitems/:id',getItemsByVisit)
router.put('/deleteitem/:id',deleteItem)
router.put('/updateitem/:id',updateItem)

module.exports = router;