const db = require("../../config/db.config");
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const common = require("../common.controller");
const Lead = db.lead;
const Supplier = db.supplier;
const SETTINGS = require("../../assets/setting");
const { success, error } = require("../../utils/restResponse");

const CONSTANTS = require("../../assets/constants");

exports.create_supplier = async (req, res) => {
  try {
    let params = req.body;

    Supplier.count({ where: { email: params.email, deleted_on: null } })
      .then(async (emailCount) => {
        if (emailCount > 0) {
          return res.send(error("Email already used!"));
        } else {
          Supplier.create({
            supplier_name: params.supplier_name,
            contact_name: params.contact_name,
            phone_number: params.phone_number,
            email: params.email,
            street_address: params.street_address,
            suburb: params.suburb,
            postal_code: params.postal_code,
            notes: params.notes,
            created_by: req.master_id,
          })
            .then(() => {
              return res.send(success("Supplier created successfully!"));
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
  } catch (err) {
    console.log(err);
  }
};

exports.findAllSupplier = async (req, res) => {
  let param = req.query;
  try {
    let datetime_format = CONSTANTS.DATE_SQL;
    let orderByField = "contact_name";
    let orderBy = "DESC";
    const isActive = param.is_active || 1;

    let where = [{is_deleted:0}];

    // LIKE QUERY
    if (!!param.search) {
      let colObj = [
        "_id",
        "supplier_name",
        "contact_name",
        "phone_number",
        "email",
        "street_address",
        "suburb",
        "postal_code",
        "notes",
        "is_deleted",
        "created_by",
        "updated_by",
        "deleted_by",
        "deleted_on",
        "created_on"

      ];
      let whereLikeObj = await common.getLikeObj(colObj, param.search);

      if (whereLikeObj.length > 0) where.push({ [Op.or]: whereLikeObj });
    }

    //  CUSTOM SEARCH
    if (param.email > 0) {
      where.push({ email: param.email });
    }

    if (param.supplier_name > 0) {
      where.push({ supplier_name: param.supplier_name });
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

    let totalRecords = await Supplier.count({
      col: "id",
      // where : where
    });
    if (totalRecords > 0) {
      Supplier.findAll({
        attributes: [
            "id",
          "supplier_name",
          "contact_name",
          "phone_number",
          "email",
          "street_address",
          "suburb",
          "postal_code",
          "notes",
          "is_deleted",
          "created_on",
          "created_by",
          "updated_by",
          "updated_on",
          "deleted_on",
          "deleted_by",
          [sequelize.fn('DATE_FORMAT', sequelize.col('created_on'), datetime_format), 'created_on'],
          [sequelize.fn('DATE_FORMAT', sequelize.col('updated_by'), datetime_format), 'updated_by'],
          [sequelize.fn('DATE_FORMAT', sequelize.col('updated_on'), datetime_format), 'updated_on'],
          [sequelize.fn('DATE_FORMAT', sequelize.col('deleted_on'), datetime_format), 'deleted_on'],
          [sequelize.fn('DATE_FORMAT', sequelize.col('deleted_by'), datetime_format), 'deleted_by'],
        ],
          
          

        
        // [sequelize.fn('date_format', sequelize.col('client.created_on'), datetime_format), 'created_date'],
        // [sequelize.fn('date_format', sequelize.col('client.updated_on'), datetime_format), 'updated_date'],
        // [sequelize.fn('CONCAT', sequelize.col('s.fname'),' ' ,sequelize.col('s.lname')), 'created_by'],
        // [sequelize.fn('CONCAT', sequelize.col('s1.fname'),' ' ,sequelize.col('s1.lname')), 'updated_by']
        // ],,
        // include: [
        //     {
        //         model: Staff,
        //         as: 's',
        //         attributes: ['fname','lname']
        //     },
        //     {
        //         model: Staff,
        //         as: 's1',
        //         attributes: ['fname','lname']
        //     }
        // ],
        order: [[sequelize.col(orderByField), orderBy]],
        where: where,
        offset: offset,
        limit: limit,
        raw: true,
      })
        .then((client) => {
          response.totalRecords = totalRecords;
          response.recordsPerPage = limit;
          response.recordsFilterd = client.length;

          client.forEach((value) => {
            value.job_id = SETTINGS.jobs[value.job_id] || client.job_id;
          });
          response.data = client;

          return res.send(success("Supplier Lists!", response));
        })
        .catch((e) => {
          console.log(e);
          return res.send(error(CONSTANTS.SQL_ERROR));
        });
    } else {
      response.totalRecords = 0;
      response.recordsPerPage = limit;
      response.data = [];
      return res.send(success("Supplier Lists!", response));
    }
  } catch (e) {
    console.log(e);
    return res.send(error(CONSTANTS.SERVER_ERROR));
  }
};

exports.update_supplier = (req, res) => {
  let params = req.body;
  const id = req.query.id;
  try {
    Supplier.count({ where: { id: id } }).then((isClientExists) => {
      if (isClientExists > 0) {
        Supplier.count({
          where: {
            email: params.email,
            deleted_on: null,
            [Op.not]: { id: id },
          },
        }).then(async (emailCount) => {
          if (emailCount > 0) {
            return res.send(error("Email already used!"));
          } else {
            Supplier.update(
              {
                supplier_name: params.supplier_name,
                contact_name: params.contact_name,
                phone_number: params.phone_number,
                email: params.email,
                street_address: params.street_address,
                suburb: params.suburb,
                postal_code: params.postal_code,
                notes: params.notes,
                created_by: req.master_id,
              },
              {
                where: { id: id },
              }
            )
              .then(() => {
                return res.send(success("Client updated successfully!"));
              })
              .catch((e) => {
                console.log(e);
                return res.send(error(CONSTANTS.SQL_ERROR));
              });
          }
        });
      } else {
        return res.send(error("Client data not found!"));
      }
    });
  } catch (e) {
    console.log(e);
    return res.send(error(CONSTANTS.SERVER_ERROR));
  }
};



exports.delete_supplier = (req, res) => {
    let params = req.body;
    const id = req.query.id;
   
  
    try {
      Supplier.count({ where: { id: id } }).then((isClientExists) => {
        if (isClientExists > 0) {
          Supplier.count({
            where: {
              email: params.email,
              deleted_on: null,
              [Op.not]: { id: id },
            },
          }).then(async (emailCount) => {
            if (emailCount > 0) {
              return res.send(error("Email already used!"));
            } else {
              Supplier.update(
                {
                  is_deleted:true
                },
                {
                  where: { id: id },
                }
              )
                .then(() => {
                  return res.send(success("Client deleted successfully!"));
                })
                .catch((e) => {
                  console.log(e);
                  return res.send(error(CONSTANTS.SQL_ERROR));
                });
            }
          });
        } else {
          return res.send(error("Client data not found!"));
        }
      });
    } catch (e) {
      console.log(e);
      return res.send(error(CONSTANTS.SERVER_ERROR));
    }
  };
  





  exports.getSupplierById = (req, res) => {
    let id = req.query.id  
    console.log(id, "adas")

    try {
        let datetime_format = CONSTANTS.DATE_SQL

        Supplier.findOne({  attributes: [
            "supplier_name",
            "contact_name",
            "phone_number",
            "email",
            "street_address",
            "suburb",
            "postal_code",
            "notes",
            "is_deleted",
            "created_on",
            "created_by",
            "updated_by",
            "updated_on",
            "deleted_on",
            "deleted_by",
            [sequelize.fn('DATE_FORMAT', sequelize.col('created_on'), datetime_format), 'created_on'],
            [sequelize.fn('DATE_FORMAT', sequelize.col('updated_by'), datetime_format), 'updated_by'],
            [sequelize.fn('DATE_FORMAT', sequelize.col('updated_on'), datetime_format), 'updated_on'],
            [sequelize.fn('DATE_FORMAT', sequelize.col('deleted_on'), datetime_format), 'deleted_on'],
            [sequelize.fn('DATE_FORMAT', sequelize.col('deleted_by'), datetime_format), 'deleted_by'],
          ],
    
        where : { id : id },
        raw : true
        }).then(client => {
            if(client != null) {
                // let i = SETTINGS.industries.find(item => item.key == client.industry_id)
                // client['industry'] = i.value || "";
                // let s = SETTINGS.sources.find(item => item.key == client.source_id)
                // client['source'] = s.value || ""
                return res.send(success("Supplier info!",client))
            } else {
                return res.send(error("Supplier data not found!"))
            }
        }).catch((e) => {
            console.log(e)
            return res.send(error(CONSTANTS.SQL_ERROR))
        })
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}