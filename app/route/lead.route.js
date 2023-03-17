const router = require("express").Router();
const { validate } = require('../middlewares/validate')
const leadValidator = require('../validator/lead.validator')
const lead = require('../controller/lead/lead.controller');

router.post("/", validate(leadValidator.add), lead.create)
    .put("/:leadId", validate(leadValidator.update), lead.update)
    .delete("/:leadId", lead.delete)
    .post("/status/:leadId", validate(leadValidator.updateStatus), lead.updateStatus)
    .get("/list", lead.leadList)
    .get("/all", lead.findAll)
    .get("/:leadId", lead.findById)

module.exports=router;