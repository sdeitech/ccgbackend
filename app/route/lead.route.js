const router = require("express").Router();
const { validate } = require('../middlewares/validate')
const leadValidator = require('../validator/lead.validator')
const lead = require('../controller/lead/lead.controller');
const multer = require('multer')


router.post("/", validate(leadValidator.add), lead.create)
    .put("/:leadId", validate(leadValidator.update), lead.update)
    .delete("/:leadId", lead.delete)
    .post("/status/:leadId", validate(leadValidator.updateStatus), lead.updateStatus)
    .get("/list", lead.leadList)
    .get("/all", lead.findAll)
    .get("/:leadId", lead.findById)


    let uploadNew = multer({
        storage: multer.diskStorage({
          destination: (req, file, callback) => {
            callback(null, "./public/upload");
          },
      
          filename: (req, file, callback) => {
            req.originalName = Date.now() + "-" + file.originalname;
      
      
            callback(null, req.originalName);
          },
        }),
      
        fileFilter(req, file, cb) {
          if (!file.originalname.match(/\.(csv|xlsx|ods)$/)) {
            return cb(new Error("Please Upload Image Only"));
          }
      
          cb(null, true);
        },
      });

      router.post('/lead-by-csv',uploadNew.single("file"), lead.importLeadFromCSV )

module.exports=router;