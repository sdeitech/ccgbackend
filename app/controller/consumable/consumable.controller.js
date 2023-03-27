const db = require('../../config/db.config')
const sequelize = db.sequelize
const Op = db.Sequelize.Op   
const common = require('../common.controller')
const Lead = db.lead
const Consumable = db.consumable
const { success, error } = require("../../utils/restResponse");
const SETTINGS = require("../../assets/setting");


const CONSTANTS = require("../../assets/constants");

exports.create_consumable = async (req, res) => {
try{
    let params = req.body
  console.log(params,"params")

    Consumable.create({
        item_name: params.item_name,
        quoted_price: params.quoted_price,
        supplier_price: params.supplier_price,
        margin_amount: params.margin_amount,
        profit_amount: params.profit_amount,
        supplier: params.supplier,
        client_name: params.client_name,
        cleaner_name: params.cleaner_name,
        quantity: params.quantity,
        date_stock_order: params.date_stock_order,
        date_stock_received: params.date_stock_received,
        invoice_status: params.invoice_status,
        // created_by: req.master_id,
      }).then(() => {
        return res.send(success("Comsumable created successfully!"));
      })
      .catch((e) => {
        console.log(e);
        return res.send(error(CONSTANTS.SQL_ERROR));
      });
}
catch(err){
console.log(err)
}


}
exports.create_consumable = async (req, res) => {
  try{
      let params = req.body
  
  
      Consumable.create({
          item_name: params.item_name,
          quoted_price: params.quoted_price,
          supplier_price: params.supplier_price,
          margin_amount: params.margin_amount,
          profit_amount: params.profit_amount,
          supplier: params.supplier,
          client_name: params.client_name,
          cleaner_name: params.cleaner_name,
          quantity: params.quantity,
          date_stock_order: params.date_stock_order,
          date_stock_received: params.date_stock_received,
          invoice_status: params.invoice_status,
          // created_by: req.master_id,
        }).then(() => {
          return res.send(success("Comsumable created successfully!"));
        })
        .catch((e) => {
          console.log(e);
          return res.send(error(CONSTANTS.SQL_ERROR));
        });
  
        
      
  
  }
  catch(err){
  console.log(err)
  }
  
  
  }



  exports.findAllConsumable = async (req, res) => {
    let param = req.query;
    try {
      let datetime_format = CONSTANTS.DATE_SQL;
      let orderByField = "item_name";
      let orderBy = "DESC";
      const isActive = param.is_active || 1;
  
      let where = [];
  
      // LIKE QUERY
      if (!!param.search) {
        let colObj = [
          "item_name",
          "quoted_price",
          "profit_amount",
          "supplier",
          "client_name",
          "cleaner_name",
          "quantity",
          "date_stock_order",
          "date_stock_received",
          "invoice_status"

        ];
        let whereLikeObj = await common.getLikeObj(colObj, param.search);
  
        if (whereLikeObj.length > 0) where.push({ [Op.or]: whereLikeObj });
      }
  
      //  CUSTOM SEARCH
      if (param.item_name > 0) {
        where.push({ item_name: param.item_name });
      }
  
      if (param.client_name > 0) {
        where.push({ client_name: param.client_name });
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
  
      let totalRecords = await Consumable.count({
        col: "id",
        // where : where
      });
      if (totalRecords > 0) {
        Consumable.findAll({
          attributes: [
            "item_name",
            "quoted_price",
            "profit_amount",
            "supplier",
            "client_name",
            "cleaner_name",
            "quantity",
            "date_stock_order",
            "date_stock_received",
            "invoice_status"
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
  
            return res.send(success("Consumable Lists!", response));
          })
          .catch((e) => {
            console.log(e);
            return res.send(error(CONSTANTS.SQL_ERROR));
          });
      } else {
        response.totalRecords = 0;
        response.recordsPerPage = limit;
        response.data = [];
        return res.send(success("Consumable Lists!", response));
      }
    } catch (e) {
      console.log(e);
      return res.send(error(CONSTANTS.SERVER_ERROR));
    }
  };
