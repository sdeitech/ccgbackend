const { success, error } = require('../../utils/restResponse')
const CONSTANTS = require("../../assets/constants")
const SETTINGS = require("../../assets/setting")

const db = require('../../config/db.config')
const sequelize = db.sequelize
const Op = db.Sequelize.Op
const common = require('../common.controller')
const { job } = require('../../config/db.config')
const Job = db.job

exports.createjob = async (req, res) => {
    let param = req.body
    try {
        let job_id = await common.getLastCounter(Job, 'job_id')
        job_id = String(parseInt(job_id) + 1).padStart(5, 0)
        let job = await Job.create({
            job_id: job_id,
            client_name: param.client_name,
            site_address: param.site_address,
            schedule_date: param.schedule_date,
            cleaning_type: param.cleaning_type,
            cleaner_assign: param.cleaner_assign,
        })
        if (job) {
            return res.send(success("job created successfully!"));
        } else {
            return res.send(error(CONSTANTS.SQL_ERROR));
        }

    } catch (err) {
        console.log(err)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}


exports.findList = async (req, res) => {

    try {
        console.log(req.query, 'asdada')
        const { page = 1, search = '', client_name = '', sort = 'client_name', order = 'DESC' } = req.query;
        const limit = CONSTANTS.PER_PAGE;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            const colObj = ['job_id', 'client_name', 'site_address', 'schedule_date', 'cleaning_type', 'cleaner_assign'];
            console.log(colObj, "colObj")
            const whereLikeObj = await common.getLikeObj(colObj, search);
            if (whereLikeObj.length > 0) where[Op.or] = whereLikeObj;
        }
        if (client_name) {
            where.client_name = client_name;
        }


        const totalRecords = await Job.count({ where });
        const jobs = await Job.findAll({
            attributes: ['job_id', 'client_name', 'site_address', 'schedule_date', 'cleaning_type', 'cleaner_assign'],
            order: [[sort, order]],
            where,
            offset,
            limit,
            raw: true,
        });
        console.log(jobs)


        const response = {
            totalRecords,
            recordsPerPage: limit,
            recordsFiltered: jobs.length,
            data: jobs,
        };
        return res.send(success('job Lists!', response));
    } catch (e) {
        console.log(e);
        return res.send(error(CONSTANTS.SERVER_ERROR));
    }
};

exports.getJobById = (req, res) => {
    let id = req.params.jobId
    console.log(id, "adas")

    try {
        let datetime_format = CONSTANTS.DATE_SQL

        Job.findOne({
            attributes: [
                'job_id',
                'client_name',
                'site_address',
                'schedule_date',
                'cleaning_type',
                'cleaner_assign',
                "created_on",
                "updated_by",
           
                [sequelize.fn('DATE_FORMAT', sequelize.col('created_on'), datetime_format), 'created_on'],
                [sequelize.fn('DATE_FORMAT', sequelize.col('updated_by'), datetime_format), 'updated_by'],
           
             
            ],

            where: { id: id },
            raw: true
        }).then(job => {
            if (job != null) {
                // let i = SETTINGS.industries.find(item => item.key == client.industry_id)
                // client['industry'] = i.value || "";
                // let s = SETTINGS.sources.find(item => item.key == client.source_id)
                // client['source'] = s.value || ""
                return res.send(success("Supplier info!", job))
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

exports.delete = (req, res) => {
    const id = req.params.jobId
    
    try {   
        Job.count({where : {job_id : id}}).then(isClientExists => {
            if(isClientExists > 0 ){
                Job.destroy({
                    where: { job_id : id }
                }).then(() => {
                    return res.send(success("Client deleted successfully!"))
                }).catch((e) => {
                    console.log(e)
                    return res.send(error(CONSTANTS.SQL_ERROR))
                })
            } else {
                return res.send(error("Job data not found!"))
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