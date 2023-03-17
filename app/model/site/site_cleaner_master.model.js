const md5 = require('md5');
const moment = require('moment');

module.exports = (sequelize, Sequelize) => {
    const SiteCleanerMaster = sequelize.define('site_cleaner_master', {}, {
        createdAt: "created_on",
        updatedAt: "updated_on",
    });
    return SiteCleanerMaster;
}