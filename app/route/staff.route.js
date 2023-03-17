// module.exports = app => {
    const router = require("express").Router()
    const { validate } = require('../middlewares/validate')
    const staffValidator = require('../validator/staff.validator')
    const staff = require('../controller/staff/staff.controller')
    const { jwt, errorHandler } = require('../utils/jwt')
  
    router.post("/login", validate(staffValidator.login), staff.login)

 
router.post("/", validate(staffValidator.add), staff.create)
    .put("/:staffId", validate(staffValidator.update), staff.update)
    .delete("/:staffId", staff.delete)
    .post("/status/:staffId", validate(staffValidator.updateStatus), staff.updateStatus)
    .get('/list', staff.staffsList)
    .get("/all", staff.findAll)
    .get("/:staffId", staff.findById)
        
module.exports=router