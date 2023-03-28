const { success, error } = require("../../utils/restResponse");
const common = require("../common.controller");
const CONSTANTS = require("../../assets/constants");
const SETTINGS = require("../../assets/setting");
const fileUpload = require("../fileUpload.controller").upload;
const csv = require("csv-parser");

const db = require("../../config/db.config");
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const Cleaner = db.cleaner;
const Lead = db.lead;
const Staff = db.staff;
const Work = db.work;
const fs = require("fs");

exports.createNewWork = async (req, res) => {
  try {
    let parameters = req.body;

    const randomNumber = Math.floor(Math.random() * 90000) + 10000;

    if (parameters) {
      let Created_work = await Work.create({
        lead_id: parameters.lead_id,
        cleanerId:parameters.cleanerId,
        Job_id: randomNumber,
        client_name: parameters.client_name,
        site_name: parameters.site_name,
        city: parameters.city,
        task_schedule: parameters.task_schedule,
        created_by: req.master_id,
      });

      if (Created_work) {
        return res.send(success("Work created successfully!"));
      } else {
        return res.send(error(CONSTANTS.SQL_ERROR));
      }
    }
  } catch (err) {
    console.log(err);
    return res.send(error(CONSTANTS.SERVER_ERROR));
  }
};
