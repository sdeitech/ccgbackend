const authRoute=require('./auth.route')
const staffRoute=require('./staff.route')
const workRoute=require('./work.route')

const consumableRoute=require('./consumable.route')
const supplierRoute=require('./supplier.route')


const cleanerRoute=require('./cleaner.route')
const leadRoute=require('./lead.route')
const clientRoute=require('./client.route')
const siteRoute=require('./site.route')
const userRoute=require('./user.route')
const commonRoute=require('./common.route')
const jobRoute=require('./job.route')
const { jwt, errorHandler } = require('../utils/jwt');

module.exports = function (app) {
    
    app.use("/api/auth",authRoute)

    app.use(errorHandler);
    app.use(jwt);

    app.use("/api/staff",staffRoute)
    app.use("/api/work",workRoute)

    app.use("/api/consumable",consumableRoute)
    app.use("/api/supplier",supplierRoute)


    app.use("/api/cleaner",cleanerRoute)
    app.use("/api/lead",leadRoute)
    app.use("/api/client",clientRoute)
    app.use("/api/site",siteRoute)
    app.use("/api/user",userRoute)
    app.use("/api",commonRoute)
    app.use("/api/job",jobRoute)
};