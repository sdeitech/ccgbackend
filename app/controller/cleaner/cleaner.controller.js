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
const Task = db.task;
const fs = require("fs");

exports.create = (req, res) => {
  let param = req.body;

  try {
    Cleaner.count({ where: { email: param.email, deleted_on: null } })
      .then(async (isEmailExists) => {
        if (isEmailExists > 0) {
          return res.send(error("Email already used!"));
        } else {
          if (!!param.contract_file) {
            param.contract_file = await fileUpload(
              param.contract_file,
              "",
              "cleaner_contract_file"
            );
            if (param.contract_file.valid) {
              param.contract_file = param.contract_file.url;
            } else {
              console.log(param.contract_file.error);
              res.send(error(CONSTANTS.SERVER_ERROR));
            }
          }
          if (!!param.insurance_file) {
            param.insurance_file = await fileUpload(
              param.insurance_file,
              "",
              "cleaner_insurance_file"
            );
            if (param.insurance_file.valid) {
              param.insurance_file = param.insurance_file.url;
            } else {
              console.log(param.insurance_file.error);
              res.send(error(CONSTANTS.SERVER_ERROR));
            }
          }
          Cleaner.create({
            name: param.name,
            phone_no: param.phone_no,
            email: param.email,
            contract_url: param.contract_file,
            insurance_url: param.insurance_file,
            insurance_expiry_date: param.insurance_expiry_date,
            email_alert: param.email_alert,
            address: param.address,
            suburb: param.suburb,
            postal_code: param.postal_code,
            emergency_contact_name: param.emergency_contact_name,
            emergency_phone_no: param.emergency_phone_no,
            notes: param.notes,
            travel_distance: param.travel_distance,
            is_active: param.is_active,
            created_by: req.master_id,
          })
            .then(() => {
              return res.send(success("Cleaner created successfully!"));
            })
            .catch((e) => {
              console.log(e);
              return res.send(error(CONSTANTS.SQL_ERROR));
            });
        }
      })
      .catch((e) => {
        console.log(e);
        return res.send(error(CONSTANTS.SQL_ERROR));
      });
  } catch (e) {
    console.log(e);
    return res.send(error(CONSTANTS.SERVER_ERROR));
  }
};

exports.findAll = async (req, res) => {
  let param = req.query;

  try {
    let datetime_format = CONSTANTS.DATE_SQL;
    let orderByField = "created_date";
    let orderBy = "DESC";
    let where = [];

    // LIKE QUERY
    if (!!param.search) {
      let colObj = [
        "name",
        "phone_no",
        "email",
        "insurance_expiry_date",
        "address",
        "suburb",
        "postal_code",
        "emergency_contact_name",
        "emergency_phone_no",
        "notes",
        "travel_distance",
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

    let totalRecords = await Cleaner.count({
      col: "id",
      // where : where
    });
    if (totalRecords > 0) {
      Cleaner.findAll({
        attributes: [
          "hashcode",
          "name",
          "phone_no",
          "email",
          "contract_url",
          "insurance_url",
          "email_alert",
          "address",
          "suburb",
          "postal_code",
          "emergency_contact_name",
          "emergency_phone_no",
          "notes",
          "job_id",
          "travel_distance",
          "is_active",
          [
            sequelize.fn(
              "date_format",
              sequelize.col("cleaner.insurance_expiry_date"),
              datetime_format
            ),
            "insurance_expiry_date",
          ],
          [
            sequelize.fn(
              "date_format",
              sequelize.col("cleaner.created_on"),
              datetime_format
            ),
            "created_date",
          ],
          [
            sequelize.fn(
              "date_format",
              sequelize.col("cleaner.updated_on"),
              datetime_format
            ),
            "updated_date",
          ],
          [
            sequelize.fn(
              "CONCAT",
              sequelize.col("s.fname"),
              " ",
              sequelize.col("s.lname")
            ),
            "created_by",
          ],
          [
            sequelize.fn(
              "CONCAT",
              sequelize.col("s1.fname"),
              " ",
              sequelize.col("s1.lname")
            ),
            "updated_by",
          ],
        ],
        include: [
          {
            model: Lead,
            attributes: [
              [sequelize.fn("IFNULL", sequelize.col("lead.id"), ""), "id"],
              [
                sequelize.fn("IFNULL", sequelize.col("lead.hashcode"), ""),
                "hashcode",
              ],
              [
                sequelize.fn("IFNULL", sequelize.col("lead.client_name"), ""),
                "client_name",
              ],
            ],
          },
          {
            model: Staff,
            as: "s",
            attributes: ["fname", "lname"],
          },
          {
            model: Staff,
            as: "s1",
            attributes: ["fname", "lname"],
          },
        ],
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

          cleaner.forEach((value) => {
            value.job_id = "";
          });
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

exports.findById = (req, res) => {
  let id = req.params.cleanerId;

  try {
    let datetime_format = CONSTANTS.DATE_SQL;

    Cleaner.findOne({
      attributes: [
        "hashcode",
        "name",
        "phone_no",
        "email",
        "contract_url",
        "insurance_url",
        "email_alert",
        "address",
        "suburb",
        "postal_code",
        "emergency_contact_name",
        "emergency_phone_no",
        "notes",
        "job_id",
        "travel_distance",
        "is_active",
        [
          sequelize.fn(
            "date_format",
            sequelize.col("cleaner.insurance_expiry_date"),
            datetime_format
          ),
          "insurance_expiry_date",
        ],
        [
          sequelize.fn(
            "date_format",
            sequelize.col("cleaner.created_on"),
            datetime_format
          ),
          "created_date",
        ],
        [
          sequelize.fn(
            "date_format",
            sequelize.col("cleaner.updated_on"),
            datetime_format
          ),
          "updated_date",
        ],
        [
          sequelize.fn(
            "CONCAT",
            sequelize.col("s.fname"),
            " ",
            sequelize.col("s.lname")
          ),
          "created_by",
        ],
        [
          sequelize.fn(
            "CONCAT",
            sequelize.col("s1.fname"),
            " ",
            sequelize.col("s1.lname")
          ),
          "updated_by",
        ],
      ],
      where: { hashcode: id },
      include: [
        {
          model: Lead,
          attributes: [
            [sequelize.fn("IFNULL", sequelize.col("lead.id"), ""), "id"],
            [
              sequelize.fn("IFNULL", sequelize.col("lead.hashcode"), ""),
              "hashcode",
            ],
            [
              sequelize.fn("IFNULL", sequelize.col("lead.client_name"), ""),
              "client_name",
            ],
          ],
        },
        {
          model: Staff,
          as: "s",
          attributes: ["fname", "lname"],
        },
        {
          model: Staff,
          as: "s1",
          attributes: ["fname", "lname"],
        },
      ],
      raw: true,
    })
      .then((cleaner) => {
        if (cleaner != null) {
          cleaner.job_id = "";
          return res.send(success("cleaners list!", cleaner));
        } else {
          return res.send(error("Cleaner data not found!"));
        }
      })
      .catch((e) => {
        console.log(e);
        return res.send(error(CONSTANTS.SQL_ERROR));
      });
  } catch (e) {
    console.log(e);
    return res.send(error(CONSTANTS.SERVER_ERROR));
  }
};

exports.update = (req, res) => {
  let param = req.body;
  const id = req.params.cleanerId;

  try {
    Cleaner.findOne({ where: { hashcode: id } })
      .then((cleanerData) => {
        if (cleanerData != null) {
          Cleaner.count({
            where: {
              email: param.email,
              [Op.not]: { hashcode: id },
              deleted_on: null,
            },
          })
            .then(async (isEmailExists) => {
              if (isEmailExists > 0) {
                return res.send(error("Email already used!"));
              } else {
                if (!!param.contract_file) {
                  param.contract_file = await fileUpload(
                    param.contract_file,
                    cleanerData.dataValues.contract_url,
                    "cleaner_contract_file"
                  );
                  if (param.contract_file.valid) {
                    param.contract_file = param.contract_file.url;
                  } else {
                    console.log(param.contract_file.error);
                    res.send(error(CONSTANTS.SERVER_ERROR));
                  }
                } else {
                  param.contract_file = cleanerData.dataValues.contract_url;
                }
                if (!!param.insurance_file) {
                  param.insurance_file = await fileUpload(
                    param.insurance_file,
                    cleanerData.dataValues.insurance_url,
                    "cleaner_insurance_file"
                  );
                  if (param.insurance_file.valid) {
                    param.insurance_file = param.insurance_file.url;
                  } else {
                    console.log(param.insurance_file.error);
                    res.send(error(CONSTANTS.SERVER_ERROR));
                  }
                } else {
                  param.insurance_url = cleanerData.dataValues.insurance_url;
                }
                Cleaner.update(
                  {
                    name: param.name,
                    phone_no: param.phone_no,
                    email: param.email,
                    contract_url: param.contract_url,
                    insurance_url: param.insurance_url,
                    insurance_expiry_date: param.insurance_expiry_date,
                    email_alert: param.email_alert,
                    address: param.address,
                    suburb: param.suburb,
                    postal_code: param.postal_code,
                    emergency_contact_name: param.emergency_contact_name,
                    emergency_phone_no: param.emergency_phone_no,
                    notes: param.notes,
                    travel_distance: param.travel_distance,
                    is_active: param.is_active,
                    updated_by: req.master_id,
                  },
                  {
                    where: { hashcode: id },
                  }
                )
                  .then(() => {
                    return res.send(success("Cleaner updated successfully!"));
                  })
                  .catch((e) => {
                    console.log(e);
                    return res.send(error(CONSTANTS.SQL_ERROR));
                  });
              }
            })
            .catch((e) => {
              console.log(e);
              return res.send(error(CONSTANTS.SQL_ERROR));
            });
        } else {
          return res.send(error("Cleaner data not found!"));
        }
      })
      .catch((e) => {
        console.log(e);
        return res.send(error(CONSTANTS.SQL_ERROR));
      });
  } catch (e) {
    console.log(e);
    return res.send(error(CONSTANTS.SERVER_ERROR));
  }
};

exports.delete = (req, res) => {
  const id = req.params.cleanerId;

  try {
    Cleaner.count({ where: { hashcode: id } })
      .then((isCleanerExists) => {
        if (isCleanerExists > 0) {
          Cleaner.destroy({
            where: { hashcode: id },
          })
            .then(() => {
              return res.send(success("Cleaner deleted successfully!"));
            })
            .catch((e) => {
              console.log(e);
              return res.send(error(CONSTANTS.SQL_ERROR));
            });
        } else {
          return res.send(error("Cleaner data not found!"));
        }
      })
      .catch((e) => {
        console.log(e);
        return res.send(error(CONSTANTS.SQL_ERROR));
      });
  } catch (e) {
    console.log(e);
    return res.send(error(CONSTANTS.SERVER_ERROR));
  }
};

exports.updateStatus = (req, res) => {
  let param = req.body;
  const id = req.params.cleanerId;

  try {
    Cleaner.count({ where: { hashcode: id } })
      .then((isCleanerExists) => {
        if (isCleanerExists > 0) {
          Cleaner.update(
            {
              is_active: param.is_active,
            },
            {
              where: { hashcode: id },
            }
          )
            .then(() => {
              return res.send(success("Cleaner status updated successfully!"));
            })
            .catch((e) => {
              console.log(e);
              return res.send(error(CONSTANTS.SQL_ERROR));
            });
        } else {
          return res.send(error("Cleaner data not found!"));
        }
      })
      .catch((e) => {
        console.log(e);
        return res.send(error(CONSTANTS.SQL_ERROR));
      });
  } catch (e) {
    console.log(e);
    return res.send(error(CONSTANTS.SERVER_ERROR));
  }
};

exports.cleanerList = (req, res) => {
  try {
    Cleaner.findAll({
      attributes: ["hashcode", "name"],
      where: { is_active: 1 },
    })
      .then((cleanerList) => {
        res.send(success("Cleaners List!", cleanerList));
      })
      .catch((e) => {
        console.log(e);
        return res.send(error(CONSTANTS.SQL_ERROR));
      });
  } catch (e) {
    console.log(e);
    return res.send(error(CONSTANTS.SERVER_ERROR));
  }
};

//?? to check
// 1. is serching with expiry date working or not

//?? to do
// 1. postalcode validation to 4 digit
// 2. image upload using s3Multer
// 3. check searching & sorting with all fields
// 4. change lead_id and job_id field to store direct value from frontEnd side, because it ain't no DD, it is TextBox used for that : IN WORK
// 5. Custom Search for [nothing]

//?? to ask
//

exports.insertCleanersByCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({
        status: "Failed",
        messageID: 400,
        message: "Source File is not uploaded",
      });
    }
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        Cleaner.create(data);
      })
      .on("end", () => {
        return res.json({
          status: "Success",
          messageID: 200,
          message: "File Imported and registered",
        });
      });
  } catch (err) {
    return res.json({
      status: "Failed",
      messageID: 400,
      message: "Source File is not uploaded",
      err: err,
    });
  }
};

exports.createNewTask = async (req, res) => {
  try {
    let parameters = req.body;

    if (parameters) {
      let Created_task = await Task.create({
        task_name: parameters.task_name,
        start_date: parameters.start_date,
        end_date: parameters.end_date,
        task_status: parameters.task_status,
        assign_to: parameters.assign_to,
        task_description: parameters.task_description,
      });

      if (Created_task) {
        return res.send(success("Task created successfully!"));
      } else {
        return res.send(error(CONSTANTS.SQL_ERROR));
      }
    }
  } catch (err) {
    console.log(err);
    return res.send(error(CONSTANTS.SERVER_ERROR));
  }
};





exports.listTaks = async (req, res) => {
    let param = req.query;
    console.log(req.query, 'params')
  
    try {
      let datetime_format = CONSTANTS.DATE_SQL;
      let orderByField = "created_date";
      let orderBy = "DESC";
      let where = [];
  
      // LIKE QUERY
      if (!!param.search) {
        let colObj = [
          "name",
          "phone_no",
          "email",
          "insurance_expiry_date",
          "address",
          "suburb",
          "postal_code",
          "emergency_contact_name",
          "emergency_phone_no",
          "notes",
          "travel_distance",
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
  
      let totalRecords = await Cleaner.count({
        col: "id",
        // where : where
      });
      if (totalRecords > 0) {
        Cleaner.findAll({
          attributes: [
            "hashcode",
            "name",
            "phone_no",
            "email",
            "contract_url",
            "insurance_url",
            "email_alert",
            "address",
            "suburb",
            "postal_code",
            "emergency_contact_name",
            "emergency_phone_no",
            "notes",
            "job_id",
            "travel_distance",
            "is_active",
            [
              sequelize.fn(
                "date_format",
                sequelize.col("cleaner.insurance_expiry_date"),
                datetime_format
              ),
              "insurance_expiry_date",
            ],
            [
              sequelize.fn(
                "date_format",
                sequelize.col("cleaner.created_on"),
                datetime_format
              ),
              "created_date",
            ],
            [
              sequelize.fn(
                "date_format",
                sequelize.col("cleaner.updated_on"),
                datetime_format
              ),
              "updated_date",
            ],
            [
              sequelize.fn(
                "CONCAT",
                sequelize.col("s.fname"),
                " ",
                sequelize.col("s.lname")
              ),
              "created_by",
            ],
            [
              sequelize.fn(
                "CONCAT",
                sequelize.col("s1.fname"),
                " ",
                sequelize.col("s1.lname")
              ),
              "updated_by",
            ],
          ],
          include: [
            {
              model: Lead,
              attributes: [
                [sequelize.fn("IFNULL", sequelize.col("lead.id"), ""), "id"],
                [
                  sequelize.fn("IFNULL", sequelize.col("lead.hashcode"), ""),
                  "hashcode",
                ],
                [
                  sequelize.fn("IFNULL", sequelize.col("lead.client_name"), ""),
                  "client_name",
                ],
              ],
            },
            {
              model: Staff,
              as: "s",
              attributes: ["fname", "lname"],
            },
            {
              model: Staff,
              as: "s1",
              attributes: ["fname", "lname"],
            },
          ],
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
  
            cleaner.forEach((value) => {
              value.job_id = "";
            });
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
