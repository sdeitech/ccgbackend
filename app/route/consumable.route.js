const router = require("express").Router();
const { validate } = require('../middlewares/validate')
const leadValidator = require('../validator/lead.validator')
const consumable = require('../controller/consumable/consumable.controller');
const multer = require('multer')


router.post("/add-consumable", consumable.create_consumable)
router.get('/get-all-consumable', consumable.findAllConsumable)
   

module.exports=router;