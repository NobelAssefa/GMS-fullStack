const User = require('../Models/user.model')
const Guest = require('../Models/guest.model')
const Department = require('../Models/Department.model')
const Visit = require('../Models/visit.model')
const Item = require('../Models/item.model')
const AsyncHandler = require('express-async-handler')

const createItem = AsyncHandler(async (req, res) => {
    const { visit_id, item_name, quantity, description,serial_number } = req.body;
  
    if (!visit_id || !item_name || !quantity || serial_number) {
      res.status(400);
      throw new Error('Visit ID, item name, serial_number and quantity are required');
    }

    const itemExists = await Item.findOne({serial_number});
    if(!itemExists){
        res.status(404);
        throw new Error('no item found');
    }
    const visit = await Visit.findById(visit_id);
    if (!visit) {
        res.status(404);
        throw new Error('Visit not found with provided Visit_id');
    }

    const item = await Item.create({
      visit_id,
      item_name,
      quantity,
      description,
      serial_number
    });
  
    res.status(201).json(item);
  });


  const getItemsByVisit = AsyncHandler(async (req, res) => {
    const { visitId } = req.params;
  
    const items = await Item.find({ visit_id: visitId });
  
    res.status(200).json(items);
  });

  const deleteItem = AsyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const item = await Item.findById(id);
  
    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }
  
    await item.remove();
  
    res.status(200).json({ message: 'Item removed' });
  });
  const updateItem = AsyncHandler(async (req,res)=>{
     const {item_name, quantity, description,serial_number } = req.body;
     const itemExist = await findOne({serial_number})
     if(!itemExist){
        res.status(404)
        throw new Error("no item found")
     }
     itemExist.item_name = item_name ||itemExist.item_name;
     itemExist.quantity = quantity || itemExist.quantity;
     itemExist.description = description || itemExist.description;
     itemExist.serial_number = serial_number || itemExist.serial_number

     const updatedItem = await itemExist.save()
     res.status(201).json(updatedItem)

  })

  module.exports = {
    createItem,getItemsByVisit,deleteItem,updateItem
  }