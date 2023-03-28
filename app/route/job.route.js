const router = require("express").Router()
// const { validate } = require('../middlewares/validate')
// const clientValidator = require('../validator/client.validator')
// const client = require('../controller/client/client.controller')
const job=require('../controller/job/job.controller')
  
router.get("/all-job", job.findList)

router.post("/create-job", job.createjob)
router.get("/job-by-id/:jobId", job.getJobById)
router.delete("/:jobId", job.delete)
        
module.exports=router