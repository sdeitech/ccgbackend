const { success, error } = require('../../utils/restResponse')
const common = require('../common.controller')
const CONSTANTS = require('../../assets/constants')
const fileUpload = require('../fileUpload.controller').upload
const SETTINGS = require('../../assets/setting')

const db = require('../../config/db.config')
const sequelize = db.sequelize
const Op = db.Sequelize.Op
const Site = db.site
const Cleaner = db.cleaner
const siteCleanerMaster = db.siteCleanerMaster
const Staff = db.staff
const Client = db.client

exports.create = async (req, res) => {
    console.log('on create')
    let param = req.body
    try {
    console.log('on try')
    console.log("param.site_contract ", param );

        param.client = await common.findExists(Client, param.client)
        console.log(param.client)
        if( !param.client.valid ){
            console.log(param.client.error)
            return res.send(error("Client Data not found!"))
        } 
        param.client= param.client.data.id

        let cleaners = await fetchCleaners(req)
        if(cleaners.valid){ 
            cleaners =  cleaners.data

            if(!!param.site_contract){
                param.site_contract = await fileUpload(param.site_contract, '', 'site_contract')
                if(param.site_contract.valid){
                    param.site_contract = param.site_contract.url
                } else {
                    console.log('ON ELSE')
                    console.log(param.site_contract.error)
                    return res.send(error(param.site_contract.error))
                }
            }
            if(!!param.cleaning_scope){
                param.cleaning_scope = await fileUpload(param.cleaning_scope, '', 'cleaning_scope')
                if(param.cleaning_scope.valid){
                    param.cleaning_scope = param.cleaning_scope.url
                } else {
                    console.log('ON ELSE')
                    console.log(param.cleaning_scope.error)
                    return res.send(error(param.cleaning_scope.error))
                }
            }

            Site.create({
                name: param.name,
                address: param.address,
                suburb: param.suburb,
                postal_code: param.postal_code,
                phone_no: param.phone_no,
                schedule_task: param.schedule_task,
                frequency: param.frequency,
                investment: param.investment,
                weekly_quoted_price: param.weekly_quoted_price,
                cleaner_weekly_amount: param.cleaner_weekly_amount,
                additional_weekly_cost: param.additional_weekly_cost,
                site_contract_url: param.site_contract,
                cleaning_scope_url: param.cleaning_scope,
                recurring_clean: param.recurring_clean,
                days: param.days.join(),
                start_time: param.start_time,
                finish_time: param.finish_time,
                alarm_code: param.alarm_code,
                key_types: param.key_types.join(),
                total_keys: param.total_keys,
                notes: param.notes,
                client_id: param.client,
                created_by: req.master_id
            }).then(site => {
                cleaners.forEach(async(value)=>{
                    const cleanerRow = await Cleaner.findByPk(value);
                    site.addCleaner(cleanerRow, { through: siteCleanerMaster });
                })
                return res.send(success('Site created successfully!', {}))
            }).catch((e) => {
                console.log(e)
                return res.send(error(CONSTANTS.SQL_ERROR))
            })
        }else {
            res.send(error(cleaners.error))
        }
        
    } catch (e) {
        console.log(e)
        console.log("pradeep")
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}

exports.findAll = async (req, res) => {
    let param = req.query

    try {
        let datetime_format = CONSTANTS.DATE_SQL
        let orderByField = 'created_date'
        let orderBy = 'DESC'
        let where = []

        if(!!param.client) {
            param.client = await common.findExists(Client, param.client)
            if(!param.client.valid){
                return res.send(error('Client Id is Invalid!'))
            }
            console.log(param.client);
            param.client = param.client.data.id
            where.push({'client_id': param.client}) 
        } else {
            return res.send(error('Client is required!'))
        }
       
        // LIKE QUERY
        if(!!param.search){
            let colObj= ['name', 'address', 'suburb', 'phone_no', 'schedule_task']
            let whereLikeObj = await common.getLikeObj(colObj, param.search)
            if(whereLikeObj.length > 0)
                where.push({[Op.or]: whereLikeObj})
        }

        // ORDER BY
        if(!!param.sort){
            orderByField= param.sort
            orderBy= param.order || 'desc'
        }

        let response = {}
        let limit = CONSTANTS.PER_PAGE
        let offset = parseInt(param.page)
        offset = (!offset || offset == 1) ? 0 : (parseInt(offset)*parseInt(CONSTANTS.PER_PAGE))-10
        
        let totalRecords =  await Site.count({
                col: 'id',
                where: [{'client_id': param.client}]
            })
            if (totalRecords > 0) {
                Site.findAll({ 
                    attributes: ['hashcode', 'name', 'address', ['suburb', 'city'], 'phone_no', 'schedule_task',
                    [sequelize.fn('date_format', sequelize.col('site.created_on'), datetime_format), 'created_date'],
                    [sequelize.fn('date_format', sequelize.col('site.updated_on'), datetime_format), 'updated_date']],
                    order: [[sequelize.col(orderByField), orderBy]],
                    where: where,
                    offset:offset, 
                    limit: limit,
                    // raw: true,
                    include: [
                        {
                            model: Client,
                            required : true,
                            attributes: ['name']
                        },
                        {
                            model: db.cleaner,
                            attributes: ['hashcode','name'],
                            through: { attributes: [] }
                        }
                    ]
                }).then(site => {
                    response.totalRecords = totalRecords
                    response.recordsPerPage = limit
                    response.recordsFilterd = site.length

                    site.forEach( ( value ) =>{
                        value.schedule_task = SETTINGS.schedule_tasks[value.schedule_task]
                    })
                    response.data = site

                    return res.send(success('Site Lists!',response))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
            } else {
                response.totalRecords = 0
                response.recordsPerPage = limit
                response.data = []
                return res.send(success('Site Lists!',response))
            }
        
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}

exports.findById = (req, res) => {
    let id = req.params.siteId  
    let datetime_format = CONSTANTS.DATE_SQL

    try {
        Site.findOne({ attributes: ['hashcode', 'name', 'address', 'suburb', 'postal_code', 'phone_no', 'schedule_task', 'frequency', 'investment', 'weekly_quoted_price', 'cleaner_weekly_amount', 'additional_weekly_cost', 'site_contract_url', 'cleaning_scope_url', 'recurring_clean', 'days', 'start_time', 'finish_time', 'alarm_code', 'key_types', 'total_keys', 'notes', 'is_active', 
        // [sequelize.fn('CONCAT', sequelize.col('s.fname'),' ' ,sequelize.col('s.lname')), 'created_by'],
        // [sequelize.fn('CONCAT', sequelize.col('s1.fname'),' ' ,sequelize.col('s1.lname')), 'updated_by']
    ],
        include: [
            {
                model: Client,
                attributes: ['name','client_id'],
                // required : true

            },
            {
                model: Staff,
                as: 's',
                attributes: ['fname','lname'],
                // required : true
            },
            {
                model: Staff,
                as: 's1',
                attributes: ['fname','lname'],
                // required : true

            },
            {
                model: db.cleaner,
                attributes: ['hashcode','name'],
                through: { attributes: [] }
            }
        ],
        where: { hashcode: id },
        subQuery: false
        // raw: true
        }).then(site => {
            if(site != null) {
                
                site.schedule_task = common.getVal(site.schedule_task, SETTINGS.schedule_tasks)
                site.frequency = common.getVal(site.frequency, SETTINGS.frequency)
                site.investment = common.getVal(site.investment, SETTINGS.investments) //SETTINGS.investments[site.investment]
                site.recurring_clean = common.getVal(site.recurring_clean, SETTINGS.recurring_cleans) //SETTINGS.recurring_cleans[site.recurring_clean]
                if(!!site.days && site.days.length > 0){
                    site.days = site.days.split(',')
                    let days = []
                    site.days.forEach((value)=> {
                        let eachDay = common.getVal(value, SETTINGS.week_days)
                        if(!!eachDay)         
                            days.push(common.getVal(value, SETTINGS.week_days))                        
                    })
                    site.days= days
                }
                console.log(site.key_types)
                if(!!site.key_types && site.key_types.length > 0){
                    site.key_types = site.key_types.split(',')
                    let key_types = []
                    site.key_types.forEach((value)=> {
                        let keys = common.getVal(value, SETTINGS.key_types)
                        if(!!keys)
                            key_types.push(common.getVal(value, SETTINGS.key_types))                        
                    })
                    site.key_types= key_types
                }
                site.created_by = site.s != null ? site.s.fname + " " + site.s.lname: "";
                site.updated_by = site.s1 != null ? site.s1.fname + " " + site.s1.lname : "";

                return res.send(success('sites list!',site))
            } else {
                return res.send(error('Site data not found!'))
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
    const id = req.params.siteId
    try {   
        Site.findOne({where: {hashcode: id}}).then(async (siteData) => {
            if(siteData != null){
                let cleaners = await fetchCleaners(req)
                if(cleaners.valid){
                    cleaners = cleaners.data 

                    if(!!param.site_contract){
                        param.site_contract = await fileUpload(param.site_contract, siteData.dataValues.site_contract_url, 'site_contract')
                        if(param.site_contract.valid){
                            param.site_contract = param.site_contract.url
                        } else {
                            console.log(param.site_contract.error)
                            return res.send(error(CONSTANTS.SERVER_ERROR))
                        }
                    } else {
                        param.site_contract = siteData.dataValues.site_contract_url
                    }
                    if(!!param.cleaning_scope){
                        param.cleaning_scope = await fileUpload(param.cleaning_scope, siteData.dataValues.cleaning_scope_url, 'cleaning_scope')
                        if(param.cleaning_scope.valid){
                            param.cleaning_scope = param.cleaning_scope.url
                        } else {
                            console.log(param.cleaning_scope.error)
                            return res.send(error(CONSTANTS.SERVER_ERROR))
                        }
                    } else {
                        param.cleaning_scope = siteData.dataValues.cleaning_scope_url
                    }
                    Site.update({
                        name: param.name,
                        address: param.address,
                        suburb: param.suburb,
                        postal_code: param.postal_code,
                        phone_no: param.phone_no,
                        schedule_task: param.schedule_task,
                        frequency: param.frequency,
                        investment: param.investment,
                        weekly_quoted_price: param.weekly_quoted_price,
                        site_weekly_amount: param.sites_weekly_amount,
                        additional_weekly_cost: param.additional_weekly_cost,
                        site_contract_url: param.site_contract,
                        cleaning_scope_url: param.cleaning_scope,
                        recurring_clean: param.recurring_clean,
                        days: param.days.join(),
                        start_time: param.start_time,
                        finish_time: param.finish_time,
                        alarm_code: param.alarm_code,
                        key_types: param.key_types.join(),
                        total_keys: param.total_keys,
                        notes: param.notes,
                        updated_by: req.master_id
                    }, {
                        where: { hashcode: id },
                        returning: true
                    }).then((site) => {
                        console.log(site)
                        cleaners.forEach(async(value)=>{
                            const cleanerRow = await Cleaner.findByPk(value);
                            siteData.addCleaner(cleanerRow, { through: siteCleanerMaster });
                        })
                        return res.send(success('Site updated successfully!'))
                    }).catch((e) => {
                        console.log(e)
                        return res.send(error(CONSTANTS.SQL_ERROR))
                    })
                }else {
                    res.send(error(cleaners.error))
                }
            } else {
                return res.send(error('Site data not found!'))
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
    const id = req.params.siteId
    
    try {   
        Site.count({where: {hashcode: id}}).then(issiteExists => {
            if(issiteExists > 0 ){
                Site.destroy({
                    where: { hashcode: id }
                }).then(() => {
                    return res.send(success('Site deleted successfully!'))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
            } else {
                return res.send(error('Site data not found!'))
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
    const id = req.params.siteId

    try {   
        Site.count({where: {hashcode: id}}).then(issiteExists => {
            if(issiteExists > 0 ){
                Site.update({
                    is_active: param.is_active,
                    updated_by: req.master_id
                }, {
                    where: { hashcode: id }
                }).then(() => {
                    return res.send(success('Site status updated successfully!'))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
            } else {
                return res.send(error('Site data not found!'))
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
    const id = req.params.siteId

    try {   
        Site.count({ where: { hashcode: id }}).then(isSiteExists => {
            if(isSiteExists > 0 ){
                Site.update({
                    is_active: param.is_active
                }, {
                    where: { hashcode: id }
                }).then(() => {
                    return res.send(success('Site status updated successfully!'))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
            } else {
                return res.send(error('Site data not found!'))
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

exports.siteList = (req, res) => {
    try {
        Site.findAll({ 
            attributes: ['hashcode', 'name'],
            where: { is_active: 1 }
        }).then(siteList => {
            res.send(success('Sites List!', siteList))
        }).catch(e => {
            console.log(e)
            return res.send(error(CONSTANTS.SQL_ERROR))
        })
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}

const fetchCleaners = async(req)=>{
    let respObj = {
        valid: false,
        data: []
    }
    try {
        let cleaners = req.body?.cleaners
        if(cleaners){
            let cleanersLen = cleaners.length
            for(let i=0; i<cleaners.length; i++){
                await Cleaner.findOne({
                    attributes: ['id'],
                    where: {hashcode: cleaners[i]}}).then(cleaner=>{
                        respObj.data.push(cleaner.dataValues.id)
                })
                if(cleanersLen == respObj.data.length){
                    respObj.valid = true
                } else {
                    respObj.error = "Cleaner not found!!"   
                }
            }
        } else {
            respObj.error = 'No cleaners found!!'
        }
    } catch (e) {
        console.log(e)
        respObj.error = 'No cleaners found!!'
    }

    return respObj
}

//?? to check
// 

//?? to do 
// 1. there is no dependency between client and site add that, take client id from front-end side
// 2. no dependency between cleaners and site while find all
// 3. remove unnecessary is_active from all apis
// 4. Custom Search for [Nothing]

//?? to ask
// 

//?? IMP notes
// 1. there are no custom search, table search and sorting there in UI : 12-25-2022