const bcrypt = require('bcrypt')
const { success, error} = require('../../utils/restResponse')
const jwt = require('jsonwebtoken')
const common = require('../common.controller')
const CONSTANTS = require("../../assets/constants")
const SETTINGS = require("../../assets/setting")

const db = require('../../config/db.config')
const sequelize = db.sequelize
const Op = db.Sequelize.Op
const Staff = db.staff
const {sendEmailNode} = require('../../utils/sendEmail')

exports.create = (req, res) => {
    let param = req.body
    console.log("pradeep sahani")
    try {
        Staff.count({ where: { 'email': param.email, deleted_on : null} }).then(async (emailCount) => {
            if (emailCount > 0) {
                return res.send(error('Email already used!'))
            } else {
                let password = CONSTANTS.staff_password 
                password = await common.generatePassword2(param.first_name, param.last_name)
                Staff.create({
                    fname: param.first_name,
                    lname: param.last_name,
                    email: param.email,
                    gender: param.gender,
                    phone_no: param.phone_no,
                    role_id : param.role,
                    address : param.address,
                    password: password,
                    is_active: param.is_active,
                    created_by: req.master_id
                }). then (staff => {
                    let mailSubject = "CCG Regisatration Mail Notification"
                    let emailBody = `Thanks for the registering with you credentials are - Email : ${param.email} and Password : ${password}`
                    let sendEmailData =  sendEmailNode(param.email,mailSubject,emailBody)
                    console.log(sendEmailData,"sendEmailData");
                    console.log("infopradeep")

                    return res.send(success('Staff created successfully!', { password }))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
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

exports.findAll = async (req, res) => {
    let param = req.query
    
    try {
        let datetime_format = CONSTANTS.DATE_SQL
        let orderByField = "created_date"
        let orderBy = "DESC"
        let where = [{ is_sub_admin: true, [Op.not]:{id: 1} }]

        // LIKE QUERY
        if(!!param.search){
            let colObj= ['fname', 'lname', 'email', 'gender', 'phone_no', 'role_id', 'address']
            let whereLikeObj = await common.getLikeObj(colObj, param.search)

            if(whereLikeObj.length > 0)
                where.push({[Op.or] : whereLikeObj})

        }
        //  CUSTOM SEARCH
        if(param.role_id > 0 ){
            where.push({ role_id: param.role_id})
        }
        
        if(param.gender > 0 ){
            where.push({ gender: param.gender})
        }

        // ORDER BY
        if(!!param.sort){
            orderByField= param.sort
            orderBy= param.order || 'desc';
        }

        let response = {}
        let limit = CONSTANTS.PER_PAGE
        param.page = parseInt(param.page) || 1;
        let offset = (param.page==1) ? 0 : (parseInt(param.page)*parseInt(CONSTANTS.PER_PAGE))-10

       let totalRecords =  await Staff.count({
                col: 'id',
                where : [{ is_sub_admin: true, [Op.not]:{id: 1} }]
            });
            if (totalRecords > 0) {
                    Staff.findAll({ attributes : ['hashcode', 'email', 'gender', 'phone_no', 'role_id', 'address', 'is_active',
                    [sequelize.fn('CONCAT', sequelize.col('staff.fname'),' ' ,sequelize.col('staff.lname')), 'name'],
                    [sequelize.fn('date_format', sequelize.col('staff.created_on'), datetime_format), 'created_date'],
                    [sequelize.fn('date_format', sequelize.col('staff.updated_on'), datetime_format), 'updated_date'],
                    [sequelize.fn('CONCAT', sequelize.col('s.fname'),' ' ,sequelize.col('s.lname')), 'created_by'],
                    [sequelize.fn('CONCAT', sequelize.col('s1.fname'),' ' ,sequelize.col('s1.lname')), 'updated_by'],
                ],
                include: [
                    {
                        model : Staff,
                        as : 's',
                        attributes : ['fname','lname']
                    },
                    {
                        model : Staff,
                        as : 's1',
                        attributes : ['fname','lname']
                    },

                ],
                order: [[sequelize.col(orderByField), orderBy]],
                where: where,
                offset:offset, 
                limit: limit,
                raw : true  
                }).then(staff => {
                    response.totalRecords = totalRecords
                    response.recordsPerPage = limit
                    response.recordsFilterd = staff.length
                    staff.forEach( ( value ) =>{
                        let r = SETTINGS.roles.find(item => item.key == value.role_id);
                        value['role'] = r.value || ""; 
                    })
                    response.data = staff
                    return res.send(success("Staff Lists!",response))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
            } else {
                response.totalRecords = 0
                response.recordsPerPage = limit
                response.data = []
                return res.send(success("Staff Lists!",response))
            }
        
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}

exports.findById = (req, res) => {
    let id = req.params.staffId  
    let datetime_format = CONSTANTS.DATE_SQL

    try {
        Staff.findOne({ attributes: ['hashcode', 'fname', 'lname', 'email', 'gender', 'phone_no', 'role_id', 'address', 'is_active',
            [sequelize.fn('date_format', sequelize.col('staff.created_on'), datetime_format), 'created_date'],
            [sequelize.fn('date_format', sequelize.col('staff.updated_on'), datetime_format), 'updated_date'], 
            [sequelize.fn('CONCAT', sequelize.col('s.fname'),' ' ,sequelize.col('s.lname')), 'created_by'],
            [sequelize.fn('CONCAT', sequelize.col('s1.fname'),' ' ,sequelize.col('s1.lname')), 'updated_by']],
            include: [
                {
                    model : Staff,
                    as : 's',
                    attributes : ['fname','lname']
                },
                {
                    model : Staff,
                    as : 's1',
                    attributes : ['fname','lname']
                },

            ],
            where : { 
                hashcode : id, 
                is_sub_admin: true, 
                [Op.not]:{id: 1}
            },
            raw : true
        }).then(staff => {
            if(staff != null) {
                let r = SETTINGS.roles.find(item => item.key == staff.role_id);
                staff['role'] = r.value || ""; 
                staff.gender_name = staff.gender == 1 ? 'Male' : 'Female';
                return res.send(success("Staffs list!",staff))
            } else {
                return res.send(error("Staff data not found!"))
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
    const id = req.params.staffId

    try {   
        Staff.count({where : {hashcode : id}}).then(isStaffExists => {
            if(isStaffExists > 0 ){
                Staff.count({ where: { 'email': param.email, deleted_on : null, 
                [Op.not]: {hashcode : id}
            } }).then(async (emailCount) => {
                    if (emailCount > 0) {
                        return res.send(error('Email already used!'))
                    } else {
                        Staff.update({
                            fname: param.first_name,
                            lname: param.last_name,
                            email: param.email,
                            gender: param.gender,
                            phone_no: param.phone_no,
                            role_id : param.role,
                            address : param.address,
                            is_active: param.is_active,
                            updated_by : req.master_id
                        }, {
                            where: { hashcode : id }
                        }).then(() => {
                            return res.send(success("Staff updated successfully!"))
                        }).catch((e) => {
                            console.log(e)
                            return res.send(error(CONSTANTS.SQL_ERROR))
                        })
                    }
                })
            } else {
                return res.send(error("Staff data not found!"))
            }
        })          
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}

exports.delete = (req, res) => {
    const id = req.params.staffId
    
    try {   
        Staff.count({where : {hashcode : id, [Op.not]:{ id:1 }, is_sub_admin:true}}).then(isStaffExists => {
            if(isStaffExists > 0 ){
                Staff.destroy({
                    where: { hashcode : id }
                }).then(() => {
                    return res.send(success("Staff deleted successfully!"))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
            } else {
                return res.send(error("Staff data not found!"))
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

exports.updateStatus = (req, res) => {
    let param = req.body
    const id = req.params.staffId

    try {   
        Staff.count({where : {hashcode : id, [Op.not]:{ id:1 }, is_sub_admin:true}}).then(isStaffExists => {
            if(isStaffExists > 0 ){
                Staff.update({
                    is_active: param.is_active,
                    updated_by: req.master_id
                }, {
                    where: { hashcode : id }
                }).then(() => {
                    return res.send(success("Staff status updated successfully!"))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
            } else {
                return res.send(error("Staff data not found!"))
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

exports.login = (req, res) => {
    let param = req.body
    
    try {
        Staff.findOne({ where: { email: param.email } }).then(async staff => {

            let s = staff.get({ plain: true })
            let validStaff = bcrypt.compareSync(param.password, s.password)

            if (!validStaff) {
                return res.send(error('login failed!'))
            }

            let token = jwt.sign(s, env.jwtsecret, {
                expiresIn: 86400 // expires in 24 hours
            })

            return res.send(success("Success",{ token }))

        }).catch(e => {
            console.log(e)
            return res.send(error('login failed!'))
        })
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}

exports.staffsList = (req, res) => {
    try {
        Staff.findAll({ 
            
            attributes: ['hashcode',
            [sequelize.fn('CONCAT', sequelize.col('fname'),' ' ,sequelize.col('lname')), 'name'],
        ],
            where : { is_active: 1, is_sub_admin: true,
                [Op.not]:{id: 1}  }
        }).then(staffsList => {
            res.send(success("Staffs List!", staffsList))
        }).catch(e => {
            console.log(e)
            return res.send(error(CONSTANTS.SQL_ERROR))
        })
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}

//?? to check
// 

//?? to do 
// 1. Custom Search for [gender, ] : DONE

//?? to ask
// 