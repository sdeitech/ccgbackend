const { success, error} = require('../../utils/restResponse')
const CONSTANTS = require("../../assets/constants")
const SETTINGS = require("../../assets/setting")

const db = require('../../config/db.config')
const sequelize = db.sequelize
const Op = db.Sequelize.Op   
const common = require('../common.controller')
const Lead = db.lead
const Staff = db.staff

exports.create = async (req, res) => {
    let param = req.body

    try {
        Staff.findOne({
            attributes: ['id'],
            where: { hashcode: param.lead_user }}).then(async(isStaffExist) => {
                if(isStaffExist != null){
                    param.lead_user = isStaffExist.dataValues.id
                    let lead_id= await common.getLastCounter(Lead, 'lead_id')
                    lead_id = String(parseInt(lead_id)+1).padStart(5,0)

                    Lead.create({
                        lead_id: lead_id,
                        client_name: param.client_name,
                        organisation: param.organisation,
                        lead_status: param.lead_status,
                        client_email: param.client_email,
                        phone_no: param.phone_no,
                        website: param.website,
                        industry_id: param.industry,
                        source_id: param.source,
                        staff_id: param.lead_user,
                        description: param.description,
                        address: param.address,
                        suburb: param.suburb,
                        postal_code: param.postal_code,
                        created_by: req.master_id
                    }).then(() => {
                        return res.send(success('Lead created successfully!'))
                    }).catch((e) => {
                        console.log(e)
                        return res.send(error(CONSTANTS.SQL_ERROR))
                    })
                } else {
                    return res.send(error('Staff not found!'))
                }
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
        let where = []
        
        // LIKE QUERY
        if(!!param.search){
            let colObj= ['client_name', 'lead_id', 'lead_status', 'client_email', 'phone_no', 'website', 'industry_id', 'source_id', 'description', 'address', 'suburb', 'postal_code', 'organisation', 'notes']
            let whereLikeObj = await common.getLikeObj(colObj, param.search)
            if(whereLikeObj.length > 0)
            where.push({[Op.or]: whereLikeObj})
        }

         // CUSTOM SEARCH
         if(param.lead_status_id > 0 ){
            where.push({ lead_status: param.lead_status_id})
        }

        // ORDER BY
        if(!!param.sort){
            orderByField= param.sort
            orderBy= param.order || 'desc'
        }

        let response = {}
        let limit = CONSTANTS.PER_PAGE
        param.page = parseInt(param.page) || 1
        let offset = (param.page==1) ? 0: (parseInt(param.page)*parseInt(CONSTANTS.PER_PAGE))-10

       let totalRecords =  await Lead.count({
                col: 'id',
                // where: where
            })
            if (totalRecords > 0) {
                    Lead.findAll({ attributes: ['hashcode', 'lead_id', 'client_name', 'lead_status', 'client_email', 'phone_no', 'website', 'industry_id', 'source_id', 'description', 'address', 'suburb', 'postal_code', 'organisation', 'notes',
                    [sequelize.fn('date_format', sequelize.col('lead.`created_on`'), datetime_format), 'created_date'],
                    [sequelize.fn('date_format', sequelize.col('lead.`updated_on`'), datetime_format), 'updated_date'],
                    [sequelize.fn('CONCAT', sequelize.col('s.fname'),' ' ,sequelize.col('s.lname')), 'created_by'],
                    [sequelize.fn('CONCAT', sequelize.col('s1.fname'),' ' ,sequelize.col('s1.lname')), 'updated_by'],
                    [sequelize.fn('CONCAT', sequelize.col('staff.fname'),' ' ,sequelize.col('staff.lname')), 'lead_name']
                ],
                    include: [
                        {
                            model: Staff,
                            attributes: ['fname','lname']

                        },
                        {
                            model: Staff,
                            as: 's',
                            attributes: ['fname','lname']
                        },
                        {
                            model: Staff,
                            as: 's1',
                            attributes: ['fname','lname']
                        }
                    ],
                order: [[sequelize.col(orderByField), orderBy]],
                where: where,
                offset:offset, 
                limit: limit,
                raw: true 
                }).then(lead => {
                    response.totalRecords = totalRecords
                    response.recordsPerPage = limit
                    response.recordsFilterd = lead.length

                    lead.forEach( ( value ) =>{
                        let l = SETTINGS.lead_status.find(item => item.key == value.lead_status)
                        value.lead_status = l.value || "" 
                        let i = SETTINGS.industries.find(item => item.key == value.industry_id)
                        value['industry'] = i.value || "" 
                        let s = SETTINGS.sources.find(item => item.key == value.source_id)
                        value['source'] = s.value || ""
                        // value['lead_name'] = `${value['staff.fname']} ${value['staff.lname']}`
                    })
                    response.data = lead

                    return res.send(success("Lead Lists!",response))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
            } else {
                response.totalRecords = 0
                response.recordsPerPage = limit
                response.data = []
                return res.send(success("Lead Lists!",response))
            }
        
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}

exports.findById = (req, res) => {
    let id = req.params.leadId
    let datetime_format = CONSTANTS.DATE_SQL
    
    try {
        Lead.findOne({ attributes: ['client_name', 'lead_id', 'lead_status', 'client_email', 'phone_no', 'website', 'industry_id', 'source_id', 'description', 'address', 'suburb', 'postal_code', 'organisation', 'notes','hashcode',
        [sequelize.fn('date_format', sequelize.col('lead.`created_on`'), datetime_format), 'created_date'],
        [sequelize.fn('date_format', sequelize.col('lead.`updated_on`'), datetime_format), 'updated_date'],
        [sequelize.fn('CONCAT', sequelize.col('s.fname'),' ' ,sequelize.col('s.lname')), 'created_by'],
        [sequelize.fn('CONCAT', sequelize.col('s1.fname'),' ' ,sequelize.col('s1.lname')), 'updated_by']], 
            where: { hashcode: id },
            include: [
                {
                    model: Staff,
                    attributes: ['fname', 'lname', 'hashcode']
                },
                {
                    model: Staff,
                    as: 's',
                    attributes: ['fname','lname']
                },
                {
                    model: Staff,
                    as: 's1',
                    attributes: ['fname','lname']
                }
            ],
            // raw: true
        }).then(lead => {
            if(lead != null) {
                lead['staff_name'] = `${lead['staff.fname']} ${lead['staff.lname']}`
                 lead['lead_status'] = SETTINGS.lead_status.find(item => item.key == lead.lead_status)
                    // lead['lead_status'] = l.value || "" 
                    lead['industry'] = SETTINGS.industries.find(item => item.key == lead.industry_id)
                    // lead['industry'] = i.value || ""
                    lead.source_id = SETTINGS.sources.find(item => item.key == lead.source_id)
                    // lead['source'] = s.value || ""
                return res.send(success("Lead data",lead))
            } else {
                return res.send(error("Lead data not found!"))
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

exports.update = async (req, res) => {
    let param = req.body
    const id = req.params.leadId

    try {
        Lead.count({where: { hashcode: id }}).then(isLeadExists => {
            if(isLeadExists > 0) {
                Lead.update({
                    client_name: param.client_name,
                    organisation: param.organisation,
                    lead_status: param.lead_status,
                    client_email: param.client_email,
                    phone_no: param.phone_no,
                    website: param.website,
                    industry_id: param.industry,
                    source_id: param.source,
                    address: param.address,
                    suburb: param.suburb,
                    postal_code: param.postal_code,
                    country_id: param.country,
                    state_id: param.state,
                    city_id: param.city,
                    updated_by: req.master_id
                }, {
                    where: { hashcode: id }
                }).then(() => {
                    return res.send(success("Lead updated successfully!"))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error("Lead updation Failed"))
                })
            } else {
                return res.send(error("Lead data not found!"))
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
    const id = req.params.leadId

    try {   
        Lead.count({ where: { hashcode: id }}).then(isLeadExists => {
            if(isLeadExists > 0 ){
                Lead.update({
                    lead_status: param.lead_status,
                    updated_by: req.master_id
                }, {
                    where: { hashcode: id }
                }).then(() => {
                    return res.send(success('Lead status updated successfully!'))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
            } else {
                return res.send(error('Lead data not found!'))
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

exports.delete = (req, res) => {
    const id = req.params.leadId
    try {
        Lead.count({where: { hashcode: id }}).then(isLeadExists => {
            if(isLeadExists > 0) {
                Lead.destroy({
                    where: { hashcode: id }
                }).then(() => {
                    return res.send(success("Lead deleted successfully!"))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error("Lead Deletion Failed"))
                })
            }  else {
                return res.send(error("Lead data not found!"))
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

exports.leadList = (req, res) => {
    try {
        Lead.findAll({ 
            attributes: ['hashcode', 'client_name'],
            where: { 
                [Op.not]: { lead_status: 5 } 
            }
        }).then(leadList => {
            res.send(success("Lead List!", leadList))
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
// 1. create new leadId : length : 5, padding: 0 : DONE
// 2. check searching & sorting with all fields
// 3. Custom Search for [lead_status]
//      3.1 add new custom search which will allow to find [openLeads, closedLeads, recently Viewed] : suggesged name for field : lead_status : already : Done
//      3.2 add new custom search which will allow to 
// 4. view ma badh records nai avta

//?? to ask
//