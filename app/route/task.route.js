const router = require("express").Router()
const { validate } = require('../middlewares/validate')
const cleanerValidator = require('../validator/cleaner.validator')
const cleaner = require('../controller/')
const multer = require('multer')
const {} = require('../middlewares/multer')

// router.post("/", validate(cleanerValidator.add), cleaner.create)
//     .get("/list", cleaner.cleanerList)
//     .put("/:cleanerId", validate(cleanerValidator.update), cleaner.update)
//     .delete("/:cleanerId", cleaner.delete)
//     .post("/status/:cleanerId", validate(cleanerValidator.updateStatus), cleaner.updateStatus)
//     .get("/all", cleaner.findAll)
//     .get("/:cleanerId", cleaner.findById)

    router.post("/list",  cleaner.createNewTask)




module.exports=router