const env = process.env

const Sequelize = require('sequelize')
const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
    host: env.DB_HOST,
    dialect: env.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialect: "mysql",
    logging: true
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize
db.db_name = env.DB_NAME
db.log_db_name = env.audit_log_db
db.Op = Sequelize.Op


//Models/tables
db.auth = require('../model/admin/auth.model.js')(sequelize, Sequelize)
db.staff = require('../model/staff/staff.model')(sequelize, Sequelize)
db.otpLog = require('../model/staff/otpLog.model')(sequelize, Sequelize)
db.lead = require('../model/lead.model.js')(sequelize, Sequelize)
db.cleaner = require('../model/cleaner.model.js')(sequelize, Sequelize)
db.client = require('../model/client.model.js')(sequelize, Sequelize)
db.site = require('../model/site/site.model.js')(sequelize, Sequelize)
db.siteCleanerMaster = require('../model/site/site_cleaner_master.model')(sequelize, Sequelize)

db.country = require('../model/common/country.model.js')(sequelize, Sequelize)
db.state = require('../model/common/state.model.js')(sequelize, Sequelize)
db.city = require('../model/common/city.model.js')(sequelize, Sequelize)

// lead relationships

// clener to lead relationship
db.lead.hasMany(db.cleaner)
db.cleaner.belongsTo(db.lead, { foreignKey: 'lead_id' }) 

// staff to staff
db.staff.belongsTo(db.staff, {
    as : 's',
    foreignKey: 'created_by'
})

db.staff.belongsTo(db.staff, {
    as : 's1',
    foreignKey: 'updated_by'
})

// staff to lead relationship
db.staff.hasMany(db.lead)
db.lead.belongsTo(db.staff, { foreignKey: 'staff_id' });

// lead to staff
db.lead.belongsTo(db.staff, {
    as : 's',
    foreignKey: 'created_by'
})

db.lead.belongsTo(db.staff, {
    as : 's1',
    foreignKey: 'updated_by'
})

// cleaner to staff relationship
db.cleaner.belongsTo(db.staff, {
    as : 's',
    foreignKey: 'created_by'
})

db.cleaner.belongsTo(db.staff, {
    as : 's1',
    foreignKey: 'updated_by'
})

// Site to Cleaner Relationship
db.site.belongsToMany(db.cleaner, {
    through: db.siteCleanerMaster,
    foreignKey: 'site_id'
})
db.cleaner.belongsToMany(db.site, {
    through: db.siteCleanerMaster,
    foreignKey: 'cleaner_id'
})

// client to staff
db.client.belongsTo(db.staff, {
    as : 's',
    foreignKey: 'created_by'
})

db.client.belongsTo(db.staff, {
    as : 's1',
    foreignKey: 'updated_by'
})

// site to staff
db.site.belongsTo(db.staff, {
    as : 's',
    foreignKey: 'created_by'
})

db.site.belongsTo(db.staff, {
    as : 's1',
    foreignKey: 'updated_by'
})

// client to Site Relationship
db.client.hasMany(db.site)
db.site.belongsTo(db.client, {foreign_key: "client_id"})

module.exports = db