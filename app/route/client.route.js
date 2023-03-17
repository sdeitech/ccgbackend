const router = require("express").Router()
const { validate } = require('../middlewares/validate')
const clientValidator = require('../validator/client.validator')
const client = require('../controller/client/client.controller')
  
router.post("/", validate(clientValidator.add), client.create)
    .put("/:clientId", validate(clientValidator.update), client.update)
    .delete("/:clientId", client.delete)
    .post("/status/:clientId", validate(clientValidator.updateStatus), client.updateStatus)
    .get('/list', client.clientList)
    .get("/all", client.findAll)
    .get("/:clientId", client.findById)
        
module.exports=router