const User = require('../Models/user.model')
const Guest = require('../Models/guest.model')
const Department = require('../Models/Department.model')
const Visit = require('../Models/visit.model')
const AsyncHandler = require('express-async-handler')
const generateUniqueCode = require('../Utils/randomFiveDigitNumber')

const createVisit = AsyncHandler(async (req, res) => {
    const { guest_id, user_id, department_id, visit_date, duration, is_approved, checked_in, checked_out } = req.body;
    if (!guest_id || !user_id || !department_id || !visit_date || !duration) {
        res.status(400);
        throw new Error('All fields are required');
    }

    const guest = await Guest.findById(guest_id);
    const user = await User.findById(user_id);
    const department = await Department.findById(department_id);
    if (!guest) {
        res.status(404);
        throw new Error('Guest not found with provided guest_id');
    } else if (!user) {
        res.status(404);
        throw new Error('User not found with provided guest_id');
    } else if (!department) {
        res.status(404);
        throw new Error('Department not found with provided guest_id');
    }
    const userRole = user.role_id.role_name; // example: "Director", "Secretary", etc.

    let isApproved = false;

    if (["SECRETARY", "VP", "PRESIDENT"].includes(userRole)) {
        isApproved = true; // Auto approve for these roles
    }

    // Generate unique code and ensure it's unique in the database
    let unique_code = generateUniqueCode();
    let existingVisit = await Visit.findOne({ unique_code });
    while (existingVisit) {
        unique_code = generateUniqueCode();
        existingVisit = await Visit.findOne({ unique_code });
    }

    const visit = await Visit.create({
        guest_id,
        user_id,
        department_id,
        visit_date,
        duration,
        is_approved: isApproved,
        checked_in,
        checked_out,
        unique_code
    });
    res.status(201).json(visit);
});

const getVisits = AsyncHandler(async (req, res) => {
    const visits = await Visit.find()
        .populate('guest_id', 'fullName phone')
        .populate('user_id', 'fullname email')
        .populate('department_id', 'departmentName')
        .populate('car', 'car_name')
        .populate('unique_code');
        
    res.status(200).json(visits);
});
const getApprovedVisits = AsyncHandler(async (req, res) => {
    const visits = await Visit.find({ is_approved: true })
        .populate('guest_id', 'fullName phone')
        .populate('user_id', 'fullname email')
        .populate('department_id', 'departmentName')
        .populate('car', 'car_name')
        .populate('unique_code');
        
    res.status(200).json(visits);
});

const getVisitsByUserId = AsyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        res.status(400);
        throw new Error('User ID is required');
    }
    const visits = await Visit.find({ user_id: userId })
        .populate('guest_id', 'fullName email')
        .populate('user_id', 'fullName email')
        .populate('department_id', 'departmentName');
    res.status(200).json(visits);
});

const approveVisit = AsyncHandler(async (req, res) => {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
        res.status(404);
        throw new Error('Visit not found');
    }

    visit.is_approved = true;
    const updatedVisit = await visit.save();
    res.status(200).json(updatedVisit);
});


const rejectVisit = AsyncHandler(async (req, res) => {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
        res.status(404);
        throw new Error('Visit not found');
    }
    if(visit.is_approved === false){
        visit.is_approved = false;
    }
    else{
        visit.is_approved = false;
    }
  
    const updatedVisit = await visit.save();
    res.status(200).json(updatedVisit);
});

const checkInVisit = AsyncHandler(async (req, res) => {
    const { unique_code } = req.params;
    const visit = await Visit.findOne({ unique_code })
        .populate('guest_id', 'fullname phone')
        .populate('user_id', 'fullname email')
        .populate('department_id', 'department_name')
        .populate('car', 'car_name');

    if (!visit) {
        res.status(404);
        throw new Error('Visit not found');
    }

    if (!visit.is_approved) {
        res.status(400);
        throw new Error('Cannot check in an unapproved visit');
    }

    if (visit.checked_in) {
        res.status(400);
        throw new Error('Guest is already checked in');
    }

    visit.checked_in = true;
    await visit.save();
    res.status(200).json({ message: 'Guest checked in successfully', visit });
});

const checkOutVisit = AsyncHandler(async (req, res) => {
    const { unique_code } = req.params
    const visit = await Visit.findOne({ unique_code: unique_code })

    if (!visit) {
        res.status(404);
        throw new Error('Visit not found');
    }
    if (!visit.is_approved) {
        res.status(400);
        throw new Error('Visit is not approved yet');
    }
    if (!visit.checked_in) {
        res.status(400);
        throw new Error('Guest has not checked in yet');
    }

    visit.checked_out = true;
    await visit.save();
    res.status(200).json({ message: 'Guest checked out successfully' });
})

module.exports = {
    createVisit,
    getVisits,
    getVisitsByUserId,
    approveVisit,
    getApprovedVisits,
    rejectVisit,
    checkInVisit,
    checkOutVisit
}