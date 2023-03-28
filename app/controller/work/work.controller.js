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
    const id = req.query.id;

    const randomNumber = Math.floor(Math.random() * 90000) + 10000;

    if (parameters) {
      let Created_work = await Work.create({
        lead_id: parameters.lead_id,
        cleanerId:id,
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



exports.getAllWorkById = async (req, res) => {
    let param = req.query;
    let cleanerId = req.query.cleanerId;
  
    try {
      let datetime_format = CONSTANTS.DATE_SQL;
      let orderByField = "created_date";
      let orderBy = "DESC";
      let where = [{
        cleaner_id:cleanerId
      }];
  
      // LIKE QUERY
      if (!!param.search) {
        let colObj = [
          "clearner_id",
          "lead_id",
          "Job_id",
          "client_name",
          "site_name",
          "city",
          "task_schedule",
         
        ];
        let whereLikeObj = await common.getLikeObj(colObj, param.search);
        if (whereLikeObj.length > 0) where.push({ [Op.or]: whereLikeObj });
      }
  
      // ORDER BY
      if (!!param.sort) {
        orderByField = param.sort;
        orderBy = param.order || "desc";
      }
  
      let response = {};
      let limit = CONSTANTS.PER_PAGE;
      param.page = parseInt(param.page) || 1;
      let offset =
        param.page == 1
          ? 0
          : parseInt(param.page) * parseInt(CONSTANTS.PER_PAGE) - 10;
  
      let totalRecords = await Work.count({
        col: "id",
        // where : where
      });
      if (totalRecords > 0) {
        Work.findAll({
          attributes: [
            "cleanerId",
            "lead_id",
            "Job_id",
            "client_name",
            "site_name",
            "city",
            "task_schedule",
           
            [
              sequelize.fn(
                "date_format",
                sequelize.col("work.created_on"),
                datetime_format
              ),
              "created_date",
            ],
            [
              sequelize.fn(
                "date_format",
                sequelize.col("work.updated_on"),
                datetime_format
              ),
              "updated_date",
            ],
            // [
            //   sequelize.fn(
            //     "CONCAT",
            //     sequelize.col("s.fname"),
            //     " ",
            //     sequelize.col("s.lname")
            //   ),
            //   "created_by",
            // ],
            // [
            //   sequelize.fn(
            //     "CONCAT",
            //     sequelize.col("s1.fname"),
            //     " ",
            //     sequelize.col("s1.lname")
            //   ),
            //   "updated_by",
            // ],
          ],
        //   include: [
        //     {
        //       model: Lead,
        //       attributes: [
        //         [sequelize.fn("IFNULL", sequelize.col("lead.id"), ""), "id"],
        //         [
        //           sequelize.fn("IFNULL", sequelize.col("lead.hashcode"), ""),
        //           "hashcode",
        //         ],
        //         [
        //           sequelize.fn("IFNULL", sequelize.col("lead.client_name"), ""),
        //           "client_name",
        //         ],
        //       ],
        //     },
        //     {
        //       model: Staff,
        //       as: "s",
        //       attributes: ["fname", "lname"],
        //     },
        //     {
        //       model: Staff,
        //       as: "s1",
        //       attributes: ["fname", "lname"],
        //     },
        //   ],
          order: [[sequelize.col(orderByField), orderBy]],
          where: where,
          offset: offset,
          limit: limit,
          raw: true,
        })
          .then((cleaner) => {
            response.totalRecords = totalRecords;
            response.recordsPerPage = limit;
            response.recordsFilterd = cleaner.length;
  
            // cleaner.forEach((value) => {
            //   value.job_id = "";
            // });
            response.data = cleaner;
  
            return res.send(success("Cleaner Lists!", response));
          })
          .catch((e) => {
            console.log(e);
            return res.send(error(CONSTANTS.SQL_ERROR));
          });
      } else {
        response.totalRecords = 0;
        response.recordsPerPage = limit;
        response.data = [];
        return res.send(success("Cleaner Lists!", response));
      }
    } catch (e) {
      console.log(e);
      return res.send(error(CONSTANTS.SERVER_ERROR));
    }
  };