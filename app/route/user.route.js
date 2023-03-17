const router = require("express").Router()
const { validate } = require('../middlewares/validate')
const userValidator = require('../validator/user.validator')
const user = require('../controller/user/user.controller')

// router.post("/login", validate(staffValidator.login), staff.login)

router.put("/profile", validate(userValidator.update), user.update)
    .get("/profile", user.findById)
        
module.exports=router