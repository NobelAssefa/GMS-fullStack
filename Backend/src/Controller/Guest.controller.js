const AsyncHandler = require('express-async-handler')
const Guest = require('../Models/guest.model');

const createGuest = AsyncHandler(async(req,res)=>{
    const{fullName,email,phone,is_vip,has_car} = req.body;
    const GuestExists = await Guest.findOne({email});
    if(GuestExists){
        res.status(400);
        throw new Error('This Guest is Already Registerd!')
    }
    if (!fullName || !email || !phone) {
        res.status(400);
        throw new Error("Please fill all required forms");
    }

    const guest = await Guest.create({
        fullName,
        email,
        phone,
        is_vip,
        has_car
    })

    res.status(201).json(guest)
});

const getGuest = AsyncHandler (async (req,res)=>{
    const Guests = await Guest.find();
    res.status(200).json(Guests)
})

const getSingleGuest = AsyncHandler (async (req,res)=>{

    const guest = await Guest.findById(req.params.id);
    if(!guest){
        res.status(404);
        throw new Error('guest not found!')
    }
    res.status(200).json(guest);
    

})


const updateGuest = AsyncHandler(async (req,res)=>{
    const{fullName,phone,is_vip,has_car} = req.body;
    const guestExists = await Guest.findById(req.params.id)
    if(!guestExists){
        res.status(404);
        throw new Error('no guest found')
    }
    if (!fullName || !phone) {
        res.status(400);
        throw new Error("Please fill all required forms");
    }

    guestExists.fullName = fullName || guestExists.fullName;
    guestExists.phone = phone || guestExists.phone;
    guestExists.is_vip = is_vip || guestExists.is_vip;
    guestExists.has_car = has_car || guestExists.has_car;

    const updatedGuest = await guestExists.save()
    res.status(201).json(updatedGuest);

});

const deleteGuest = AsyncHandler(async (req,res)=>{
    const guest = await Guest.findById(req.params.id)
    if(!guest){
        res.status(404);
        throw new Error('no guest found!')
    }
   await guest.deleteOne();
    res.status(200).json({message:"guset successfuly deleted!"})

});


module.exports = {
    createGuest,getGuest,getSingleGuest,updateGuest,deleteGuest
};
