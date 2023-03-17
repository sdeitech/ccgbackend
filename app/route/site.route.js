const router = require("express").Router()
const { validate } = require('../middlewares/validate')
const siteValidator = require('../validator/site.validator')
const site = require('../controller/site/site.controller')

router.post("/", validate(siteValidator.add), site.create)
    .get("/list", site.siteList)
    .put("/:siteId", validate(siteValidator.update), site.update)
    .delete("/:siteId", site.delete)
    .post("/status/:siteId", validate(siteValidator.updateStatus), site.updateStatus)
    .get("/all", site.findAll)
    .get("/:siteId", site.findById)

module.exports=router
