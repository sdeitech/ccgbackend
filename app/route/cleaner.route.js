const router = require("express").Router()
const { validate } = require('../middlewares/validate')
const cleanerValidator = require('../validator/cleaner.validator')
const cleaner = require('../controller/cleaner/cleaner.controller')
const multer = require('multer')
const {} = require('../middlewares/multer')

router.post("/", validate(cleanerValidator.add), cleaner.create)
    .get('/all-task',cleaner.findList)
    .get("/list", cleaner.cleanerList)
    .put("/:cleanerId", validate(cleanerValidator.update), cleaner.update)
    .delete("/:cleanerId", cleaner.delete)
    .post("/status/:cleanerId", validate(cleanerValidator.updateStatus), cleaner.updateStatus)
    .get("/all", cleaner.findAll)
    .get("/:cleanerId", cleaner.findById)
<<<<<<< HEAD
 
=======
    .post("/create",  cleaner.createNewTask)
    

>>>>>>> 040c851c196552110f5db7103053992b8122afb6


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
          if (!file.originalname.match(/\.(csv)$/)) {
            return cb(new Error("Please Upload Image Only"));
          }
      
          cb(null, true);
        },
      });
     

    router.post('/cleaner-by-csv',uploadNew.single("file"), cleaner.insertCleanersByCSV )


    

    



module.exports=router
