


const db = require('../../config/db.config')
const sequelize = db.sequelize
const Op = db.Sequelize.Op   
const common = require('../common.controller')
const Lead = db.lead
const Consumable = db.consumable
const { success, error } = require("../../utils/restResponse");

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

exports.findAll = async (req, res) => {
  let param = req.query
    
  try {
    let datetime_format = CONSTANTS.DATE_SQL
    let orderByField = "created_date"
    let orderBy = "DESC"
    let where = [{ is_sub_admin: true, [Op.not]:{id: 1} }]

    if(!!param.search){
      let colObj= ['fname', 'lname', 'email', 'gender', 'phone_no', 'role_id', 'address']
      let whereLikeObj = await common.getLikeObj(colObj, param.search)

      if(whereLikeObj.length > 0)
          where.push({[Op.or] : whereLikeObj})

  }

  const user = await Consumable.findAll();
  console.log(user,"user List")


  }catch{

  }
}