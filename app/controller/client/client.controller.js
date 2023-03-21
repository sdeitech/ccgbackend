const { success, error} = require('../../utils/restResponse')
const CONSTANTS = require("../../assets/constants")
const SETTINGS = require("../../assets/setting")

const db = require('../../config/db.config')
const sequelize = db.sequelize
const Op = db.Sequelize.Op
const common = require('../common.controller')
const Client = db.client
const Staff = db.staff

exports.create = (req, res) => {
    let param = req.body
    try {
        Client.count({ where: { 'contact_email': param.contact_email, deleted_on : null} }).then(async (emailCount) => {
            if (emailCount > 0) {
                return res.send(error('Email already used!'))
            } else {
                let client_id= await common.getLastCounter(Client, 'client_id')
                client_id = String(parseInt(client_id)+1).padStart(5,0)
                Client.create({
                    client_id: client_id,
                    name: param.business_name,
                    phone_no: param.business_phone_no,
                    contact_name: param.contact_name,
                    contact_email: param.contact_email,
                    contact_phone_no: param.contact_phone_no,
                    website: param.website,
                    industry_id: param.industry,
                    source_id: param.source,
                    comments: param.comment,
                    created_by: req.master_id
                }).then(() => {
                    return res.send(success('Client created successfully!'))
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
        let where = [];
       
        // LIKE QUERY
        if(!!param.search){
            let colObj= ['hashcode','client_id', 'name', 'phone_no', 'contact_name', 'is_active','contact_email', 'contact_phone_no', 'website', 'source_id', 'comments']
            let whereLikeObj = await common.getLikeObj(colObj, param.search)

        if(whereLikeObj.length > 0)
            where.push({[Op.or]: whereLikeObj})
        }

        //  CUSTOM SEARCH
        if(param.industry_id > 0 ){
            where.push({ industry_id: param.industry_id})
        }

        if(param.is_active > 0 ){
            where.push({ is_active: param.is_active})
        }

        // ORDER BY
        if(!!param.sort){
            orderByField= param.sort
            orderBy= param.order || 'desc'
        }

        let response = {}
        let limit = CONSTANTS.PER_PAGE;
        param.page = parseInt(param.page) || 1;
        let offset = (param.page==1) ? 0 : (parseInt(param.page)*parseInt(CONSTANTS.PER_PAGE))-10

       let totalRecords =  await Client.count({
                col: 'id',
                // where : where
            });
            if (totalRecords > 0) {
                    Client.findAll({ attributes : ['hashcode', 'client_id', 'name', 'phone_no', 'contact_name', 'contact_email', 'contact_phone_no', 'website', 'industry_id', 'source_id', 'comments', 'is_active', 
                    [sequelize.fn('date_format', sequelize.col('client.created_on'), datetime_format), 'created_date'],
                    [sequelize.fn('date_format', sequelize.col('client.updated_on'), datetime_format), 'updated_date'],
                    [sequelize.fn('CONCAT', sequelize.col('s.fname'),' ' ,sequelize.col('s.lname')), 'created_by'],
                    [sequelize.fn('CONCAT', sequelize.col('s1.fname'),' ' ,sequelize.col('s1.lname')), 'updated_by']
                ],
                include: [
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
                raw : true
                }

                ).then(client => {
                    response.totalRecords = totalRecords
                    response.recordsPerPage = limit
                    response.recordsFilterd = client.length

                    client.forEach( ( value ) =>{
                        value.job_id = SETTINGS.jobs[value.job_id] || client.job_id 
                    })
                    response.data = client

                    return res.send(success("Client Lists!",response))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
            } else {
                response.totalRecords = 0
                response.recordsPerPage = limit
                response.data = []
                return res.send(success("Client Lists!",response))
            }
        
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}

exports.findById = (req, res) => {
    let id = req.params.clientId  

    try {
        let datetime_format = CONSTANTS.DATE_SQL

        Client.findOne({ attributes: ['hashcode', 'client_id', 'name', 'phone_no', 'contact_name', 'contact_email', 'contact_phone_no', 'website', 'industry_id', 'source_id', 'comments', 'is_active', 
        [sequelize.fn('date_format', sequelize.col('client.created_on'), datetime_format), 'created_date'],
        [sequelize.fn('date_format', sequelize.col('client.updated_on'), datetime_format), 'updated_date'], 
        [sequelize.fn('CONCAT', sequelize.col('s.fname'),' ' ,sequelize.col('s.lname')), 'created_by'],
        [sequelize.fn('CONCAT', sequelize.col('s1.fname'),' ' ,sequelize.col('s1.lname')), 'updated_by']
    ],
        include: [
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
        where : { hashcode : id },
        raw : true
        }).then(client => {
            if(client != null) {
                let i = SETTINGS.industries.find(item => item.key == client.industry_id)
                client['industry'] = i.value || "";
                let s = SETTINGS.sources.find(item => item.key == client.source_id)
                client['source'] = s.value || ""
                return res.send(success("Client list!",client))
            } else {
                return res.send(error("Client data not found!"))
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
    const id = req.params.clientId

    try {   
        Client.count({ where: { hashcode: id}}).then(isClientExists => {
            if(isClientExists > 0 ){
                Client.count({ where: { 'contact_email': param.contact_email, deleted_on : null, 
                [Op.not]: { hashcode: id }
            } }).then(async (emailCount) => {
                    if (emailCount > 0) {
                        return res.send(error('Email already used!'))
                    } else {
                        Client.update({
                            name: param.business_name,
                            phone_no: param.business_phone_no,
                            contact_name: param.contact_name,
                            contact_email: param.contact_email,
                            contact_phone_no: param.contact_phone_no,
                            website: param.website,
                            industry_id: param.industry,
                            source_id: param.source,
                            comments: param.comment,
                            is_active: param.active || 1,
                            updated_by : req.master_id
                        }, {
                            where: { hashcode : id }
                        }).then(() => {
                            return res.send(success("Client updated successfully!"))
                        }).catch((e) => {
                            console.log(e)
                            return res.send(error(CONSTANTS.SQL_ERROR))
                        })
                    }
                })
            } else {
                return res.send(error("Client data not found!"))
            }
        })          
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}

exports.delete = (req, res) => {
    const id = req.params.clientId
    
    try {   
        Client.count({where : {hashcode : id}}).then(isClientExists => {
            if(isClientExists > 0 ){
                Client.destroy({
                    where: { hashcode : id }
                }).then(() => {
                    return res.send(success("Client deleted successfully!"))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
            } else {
                return res.send(error("Client data not found!"))
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
    const id = req.params.clientId

    try {   
        Client.count({where : {hashcode : id}}).then(isClientExists => {
            if(isClientExists > 0 ){
                Client.update({
                    is_active: param.is_active,
                    updated_by: req.master_id
                }, {
                    where: { hashcode : id }
                }).then(() => {
                    return res.send(success("Client status updated successfully!"))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
            } else {
                return res.send(error("Client data not found!"))
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

exports.clientList = (req, res) => {
    try {
        Client.findAll({ 
            attributes: ['hashcode', 'name'],
            where : { is_active: 1 }
        }).then(clientList => {
            res.send(success("Client List!", clientList))
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
// 1. change source_id from integer store to string store because from client side it is Textbox not DD : {source_id to source}
// 2. Custom Search for [industry] -- DONE
// ->Which Paramete is Used To show Client Status In Client Listing API Response
// ->Which Paramete is Used To show Schedule In Client Listing API 
// ->Which Paramete is Used To show Payment Cycle In Client Listing API
// ->Which Paramete is Used To show Amount In Client Listing API

//?? to ask
// 