const common = require('../controller/common.controller');
const router = require("express").Router();

router.get('/timezone', common.timeZone)
    .get('/dateformat', common.dateFormat)
    .get('/timeformat', common.timeFormat)
    .get('/languages', common.languages)
    .get('/week_days', common.week_days)
    .get('/apistatus', common.apiStatus)
    .get('/countries', common.countries)
    .get('/states', common.states)
    .get('/cities', common.cities)
    .get('/organisatoins', common.organisations)
    .get('/lead_statuses', common.lead_status)
    .get('/industries', common.industries)
    .get('/sources', common.sources)
    .get('/jobs', common.jobs)
    .get('/roles', common.roles)
    .get('/scheduletaskslist', common.schedule_tasks_list)
    .get('/investments', common.investments)
    .get('/frequency', common.frequency)
    .get('/recurringcleanlist', common.recurring_clean)

module.exports = router