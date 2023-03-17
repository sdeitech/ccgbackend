const { success, error} = require('../../utils/restResponse')
const CONSTANTS = require("../../assets/constants")

const db = require('../../config/db.config')
const Op = db.Sequelize.Op
const Staff = db.staff

exports.findById = (req, res) => {
    let id = req.master_id  

    try {
        Staff.findOne({ attributes: ['hashcode', 'fname', 'lname', 'email', 'gender', 'phone_no', 'address'],
            where : { 
                id : id, 
                
            }
        }).then(staff => {
            if(staff != null) {
                return res.send(success("Profile Data!",staff))
            } else {
                return res.send(error("User data not found!"))
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

exports.update = (req, res) => {
    let param = req.body
    const id = req.master_id

    try {   
        Staff.count({where : { id : id, is_active:1 }}).then(isStaffExists => {
            if(isStaffExists > 0 ){
            //     Staff.count({ where: { 'email': param.email, deleted_on : null, 
            //     [Op.not]: {id : id}
            // } }).then(async (emailCount) => {
            //         if (emailCount > 0) {
            //             return res.send(error('Email already used!'))
            //         } else {
                        Staff.update({
                            fname: param.first_name,
                            lname: param.last_name,
                            // email: param.email,
                            gender: param.gender,
                            phone_no: param.phone_no,
                            address : param.address,
                            // password: param.password,
                            updated_by : req.master_id
                        }, {
                            where: { id : id }
                        }).then(() => {
                            return res.send(success("Profile updated successfully!"))
                        }).catch((e) => {
                            console.log(e)
                            return res.send(error(CONSTANTS.SQL_ERROR))
                        })
                //     }
                // })
            } else {
                return res.send(error("User data not found!"))
            }
        })          
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}