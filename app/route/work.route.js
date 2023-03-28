const router = require("express").Router()
const { validate } = require('../middlewares/validate')
const cleanerValidator = require('../validator/cleaner.validator')
const work = require('../controller/work/work.controller')
const multer = require('multer')


// router.post("/", validate(cleanerValidator.add), cleaner.create)
//     .get("/list", cleaner.cleanerList)
//     .put("/:cleanerId", validate(cleanerValidator.update), cleaner.update)
//     .delete("/:cleanerId", cleaner.delete)
//     .post("/status/:cleanerId", validate(cleanerValidator.updateStatus), cleaner.updateStatus)
//     .get("/all", cleaner.findAll)
//     .get("/:cleanerId", cleaner.findById)

    router.post("/add-work",  work.createNewWork)
    router.get("/work-by-id",  work.getAllWorkById)








module.exports=router