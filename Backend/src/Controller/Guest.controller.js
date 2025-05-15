const AsyncHandler = require('express-async-handler')
const Guest = require('../Models/guest.model');
const User = require('../Models/user.model');

// Create a new guest (basic info only, no car/items)
const createGuest = AsyncHandler(async(req, res) => {
    const { fullName, email, phone, is_vip, profileImage } = req.body;
    const GuestExists = await Guest.findOne({ email });
    if (GuestExists) {
        res.status(400);
        throw new Error('A guest with this email is already registered!')
    }
    if (!fullName || !email || !phone) {
        res.status(400);
        throw new Error("Please fill all required fields");
    }
    // req.user._id should be set by auth middleware
    const guest = await Guest.create({
        fullName,
        email,
        phone,
        is_vip: is_vip || false,
        profileImage,
        registeredBy: req.user._id
    });
    res.status(201).json(guest);
});

// Get all guests (basic info only)
const getGuests = AsyncHandler(async (req, res) => {
    const guests = await Guest.find().populate('registeredBy', 'fullName email');
    console.log('Sending guests data:', guests); // Debug log
    res.status(200).json(guests);
});

// Get a single guest (basic info only)
const getSingleGuest = AsyncHandler(async (req, res) => {
    const guest = await Guest.findById(req.params.id).populate('registeredBy', 'fullName email');
    if (!guest) {
        res.status(404);
        throw new Error('Guest not found!')
    }
    res.status(200).json(guest);
});

// Get guests registered by the current user
const getGuestsByRegisteredUser = AsyncHandler(async (req, res) => {
    try {
        // req.user._id should be set by auth middleware
        const guests = await Guest.find({ registeredBy: req.user._id })
            .populate('registeredBy', 'fullName email')
            .sort({ createdAt: -1 }); // Sort by newest first

        console.log(`Found ${guests.length} guests registered by user ${req.user._id}`);
        res.status(200).json(guests);
    } catch (error) {
        console.error('Error fetching guests by user:', error);
        res.status(500);
        throw new Error('Failed to fetch guests registered by user');
    }
});

const updateGuest = AsyncHandler(async (req,res)=>{
    const{fullName,phone,is_vip,has_car,plateNumber,carModel,carColor,items,profileImage} = req.body;
    const guestExists = await Guest.findById(req.params.id)
    if(!guestExists){
        res.status(404);
        throw new Error('Guest not found!')
    }
    if (!fullName || !phone) {
        res.status(400);
        throw new Error("Please fill all required fields");
    }
    if (has_car && (!plateNumber || !carModel || !carColor)) {
        res.status(400);
        throw new Error("Please provide all car details");
    }

    guestExists.fullName = fullName || guestExists.fullName;
    guestExists.phone = phone || guestExists.phone;
    guestExists.is_vip = is_vip !== undefined ? is_vip : guestExists.is_vip;
    guestExists.has_car = has_car || guestExists.has_car;
    guestExists.profileImage = profileImage || guestExists.profileImage;

    if (has_car) {
        await Car.findOneAndUpdate(
            { guest: guestExists._id },
            {
                plateNumber,
                carModel,
                carColor,
                guest: guestExists._id
            },
            { upsert: true, new: true }
        );
    } else {
        await Car.findOneAndDelete({ guest: guestExists._id });
    }

    if (items) {
        await Item.deleteMany({ guest: guestExists._id });
        
        if (items.length > 0) {
            const itemPromises = items.map(item => 
                Item.create({
                    name: item.name || item,
                    description: item.description || '',
                    isChecked: item.isChecked || false,
                    guest: guestExists._id
                })
            );
            await Promise.all(itemPromises);
        }
    }

    const updatedGuest = await guestExists.save()
    res.status(201).json(updatedGuest);

});

const deleteGuest = AsyncHandler(async (req,res)=>{
    const guest = await Guest.findById(req.params.id)
    if(!guest){
        res.status(404);
        throw new Error('Guest not found!')
    }
   await guest.deleteOne();
    res.status(200).json({message:"Guest deleted successfully"})

});

module.exports = {
    createGuest, getGuests, getSingleGuest, updateGuest, deleteGuest, getGuestsByRegisteredUser
};
