const AsyncHandler = require('express-async-handler');
const Car = require('../Models/car.model')
const Guest = require('../Models/guest.model')

const createCar = AsyncHandler(async (req, res) => {
    const { guest_id, plate_number, color, model } = req.body;
    
    if (!guest_id || !plate_number) {
        res.status(400);
        throw new Error('Guest ID and Plate Number are required');
    }
    const guest = await Guest.findById(guest_id);
    if (!guest) {
      res.status(404);
      throw new Error('Guest not found with provided guest_id');
    }

    const car = await Car.create({ guest_id, plate_number, color, model  });
    res.status(201).json(car)

});

const getCarByGuest = AsyncHandler(async (req, res) => {
    const { guestId } = req.params;
  
    const car = await Car.findOne({ guest_id: guestId });
  
    if (!car) {
      res.status(404);
      throw new Error('Car not found');
    }
  
    res.status(200).json(car);
  });

const getCar = AsyncHandler (async (req,res)=>{
    const car = await Car.find()
    res.status(200).json(car)
});

const getSingleCar  = AsyncHandler(async (req,res)=>{
    const car = await Car.findById(req.params.id)
    if(car){
        res.status(200).json(car);

    }else{
        res.status(400);
        throw new Error('no car found!')
    }

});

const updateCar = AsyncHandler(async (req,res)=>{
    const { plate_number, color, model } = req.body;
    const carExists = await Car.findById(req.params.id)
    if(!carExists){
        res.status(404)
        throw new Error('No car found!')
    }
    carExists.plate_number = plate_number ||  carExists.plate_number;
    carExists.color = color || carExists.car;
    carExists.model = model || carExists.model;
    const updatedCar = await carExists.save();
    res.status(200).json(updatedCar)
});


const deleteCar = AsyncHandler(async (req,res)=>{
    const car = await Car.findById(req.params.id);
    if(!car){
        res.status(404)
        throw new Error('no car exists!');
    }
    await car.deleteOne();
    res.status(200).json({ message: 'car deleted successfully' });
})

module.exports = {
    createCar,getCar,getSingleCar,updateCar,deleteCar,getCarByGuest
}