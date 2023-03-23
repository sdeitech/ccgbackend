const router = require("express").Router();
const { validate } = require('../middlewares/validate')
const leadValidator = require('../validator/lead.validator')
const supplier = require('../controller/supplier/supplier.controller');
const multer = require('multer')


router.post("/add-supplier", supplier.create_supplier)
router.get("/get-all-supplier", supplier.findAllSupplier)

   

module.exports=router;