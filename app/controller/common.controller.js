const multer = require('multer');
const path = require('path')
const bcrypt = require('bcrypt');
const disposableEmail = require('../assets/disposableMail');
const setting = require('../assets/setting');
const { success, error} = require('../utils/restResponse');
const _ = require('lodash');

const db = require('../config/db.config');
const sequelize = db.sequelize;
const CONSTANTS = require('../assets/constants')
const {country, state, city, staff} = require('../config/db.config')
const Op = db.Sequelize.Op

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        let file_path = Date.now() + path.extname(file.originalname)
        req.file_path = file_path;
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            return cb(null);
        }
    }
})

exports.uploadFile = upload.single('image_url'),
    function (req, res, next) {
    }

exports.generateUserName = function () {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

/**
 * @description Generate password hash using bcrypt algorithm
 * @param {*} strPassword | empty ? return hash of string : return newPassword, hash 
 * @returns object { password , hash }
 */
exports.generatePassword = async (strPassword = "") => {

    if(!strPassword){
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#%&*()/?';
        let charactersLength = characters.length;
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        strPassword = result
    }
    return strPassword
}
exports.generatePassword2 = async (firstName, lastName) =>
{
    const date = new Date();
    const month = date.getMonth() + 1; // Adding 1 since getMonth() returns 0-indexed values
    const year = date.getFullYear().toString().slice(-2); // Taking last 2 digits of the year
    
    // Concatenating parts of the name with month and year, and adding random characters
    const password = firstName.slice(0, 2) + lastName.slice(0, 2) + month + year + getRandomChars(2);
    
    return password;
  }


  function getRandomChars(num) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=";
    let randomChars = "";
    
    for (let i = 0; i < num; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      randomChars += chars[randomIndex];
    }
    
    return randomChars;
  }







exports.generateOTP = async () => {

   return Math.round(1000 + Math.random() * 9000);
}



exports.disposableEmail = (email) => {
    const address = email.split('@').pop()
    return disposableEmail.mail.includes(address);
}

exports.currentDateTime = () => {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let CurrentDateTime = date + ' ' + time;
    return CurrentDateTime;
}

exports.timeZone = (req, res) => {
    let data = setting.timezone;
    return res.send(success(Object.keys(data), "Timezone format List"));
}

exports.dateFormat = (req, res) => {
    let data = setting.date_format;
    return res.send(success(Object.keys(data), "Date format List"));
}

exports.timeFormat = (req, res) => {
    let data = setting.time_format;
    return res.send(success(Object.keys(data), "Time format List"));
}

exports.getCallerIP = (request) => {
    let ip = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
    return ip;
}

exports.auditLog = (insertData, oldData, tableName, info, db_name = '') => {
    return new Promise(function (resolve, reject) {
        db_name = db_name == '' ? db.log_db_name : db_name + '_logs';
        info.lkid = info.lkid == "undefined" ? 0 : info.lkid;
        let iD = {};
        let oD = {};

        function filter(newData, oldData) {
            if (_.isEqual(newData, oldData) == false) {
                if (Object.keys(newData).length > 0) {
                    let data = newData;
                    data = (Object.keys(oldData).length > Object.keys(newData).length) ? oldData : newData;
                    for (key in data) {
                        if (typeof newData[key] == 'object' && typeof oldData[key] == 'object') {
                            if (_.isEqual(newData[key], oldData[key]) == false) {
                                if (newData[key] == oldData[key]) {
                                    continue;
                                } else {
                                    filter(newData[key], oldData[key]);
                                    // oD[key] = oldData[key];
                                    // iD[key] = newData[key]; 
                                }
                            }
                        }
                        else if (Array.isArray(newData[key]) == true && Array.isArray(oldData[key]) == true) {
                            filter(newData[key], oldData[key]);
                        }
                        else if (_.isEqual(newData[key], oldData[key]) == false) {
                            if (oldData[key] == newData[key]) {
                                continue;
                            } else {
                                oD[key] = oldData[key];
                                iD[key] = newData[key];
                            }
                        }
                    }
                } else if (Object.keys(oldData).length > 0) {
                    for (key in oldData) {
                        if (typeof newData[key] == 'object' && typeof oldData[key] == 'object') {
                            if (_.isEqual(newData[key], oldData[key]) == false) {
                                if (newData[key] == oldData[key]) {
                                    continue;
                                } else {
                                    oD[key] = oldData[key];
                                    iD[key] = newData[key];
                                }
                            }
                        }
                        else if (Array.isArray(newData[key]) == true && Array.isArray(oldData[key]) == true) {
                            filter(newData[key], oldData[key]);
                        }
                        else if (_.isEqual(newData[key], oldData[key]) == false) {
                            if (oldData[key] == newData[key]) {
                                continue;
                            } else {
                                oD[key] = oldData[key];
                                iD[key] = newData[key];
                            }
                        }
                    }
                } else {
                    console.log('Major')
                }
            }
        }

        filter(insertData, oldData);

        if (Object.keys(iD).length > 0 || Object.keys(oD).length > 0) {
            iD = JSON.stringify(iD);
            oD = JSON.stringify(oD);

            let statement = "insert into " + db_name + "." + tableName + "(module,tablename,userid,title,jsondata,jsondataold,currenttime,companyid,locationid,userip,pkid,lkid,hashcode) values (?,?,?,?,?,?,NOW(),?,?,?,?,?,?) ";
            sequelize.query(statement, { replacements: [info.module, info.tablename, info.userid, info.title, iD, oD, info.company_id, info.location_id, info.userip, info.pkid, info.lkid, info.hashcode], type: sequelize.QueryTypes.INSERT }).then(([affectedCount, affectedRows]) => {
                resolve(1);
            }).catch(function (e) {
               
                resolve(1);
            });
        }
        else {
            resolve(1);
        }
    })
}

exports.auditLogBulk = (insertData, tableName, info, db_name = '') => {
    return new Promise(function (resolve, reject) {
        db_name = db_name == '' ? db.log_db_name : db_name + '_logs';
        // let a = insertData !== {} ? JSON.stringify(insertData) : '';

        let replacements = [];
        let statement = "INSERT INTO " + db_name + "." + tableName + "(module,tablename,userid,title,jsondata,currenttime,companyid,locationid,userip,pkid,lkid) VALUE ";
        if (insertData.length > 0) {
            for (let i = 0; i < insertData.length; i++) {
                if (i > 0) {
                    statement += ",";
                }
                statement += " (?,?,?,?,?,NOW(),?,?,?,?,?) ";
                replacements.push(info.module, info.tablename, info.userid, info.title, JSON.stringify(insertData[i]), info.company_id, info.location_id, info.userip, info.pkid, insertData[i].id == undefined ? 0 : insertData[i].id);
            }
        }
        sequelize.query(statement, { replacements: replacements, type: sequelize.QueryTypes.INSERT }).then(([affectedCount, affectedRows]) => {
            resolve(1);
        }).catch(function (e) {
           
            resolve(1);
        });
    })
}

// exports.dataVal = (val) => {
//     let dataVal = {};
//     if (val.length > 0) {
//         val.forEach(ele => {
//             dataVal[ele.name] = ele.value
//         });
//     }
//     return dataVal;
// }

// exports.getLikeObj = (val) => {
//     let likeQuery = [];
//     if(val.sSearch.trim() !== ""){
//         for(j = 0;j <= val.iColumns;j++){
//             let searchName1 = 'mDataProp_' + j;
//             let isSearchable = 'bSearchable_' + j;
//             if(val[isSearchable]){
//                searchValue = val[searchName1];
//                likeQuery.push({ [searchValue] : {[Op.like]: '%'+ val.sSearch+'%'} });
//             }

//         }
//     }
//     return likeQuery;
// }

exports.languages = (req, res) => {
    let data = setting.language_codes;
    return res.send(success(data, "Language List"));
}

exports.decodeBase64Image = (dataString) => {
    dataString = Object.values(dataString)[0];
    let matches = dataString.match(/^data:([A-Za-z-+.\/]+);base64,(.+)$/),
        response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.ext = dataString.match(/[^:/]\w+(?=;|,)/)[0];
    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');

    return response;
    // return dataString;
}

exports.week_days = (req, res) => {
    let data = setting.week_days;
    return res.send(success(data, "Days list"));
}

exports.activity_logs = (req, res) => {
    return new Promise(function (resolve, reject) {
        let param = req.body;
        if (param.module == 'setting') {
            let statement = "SELECT `logs`.title,`logs`.jsondata,`logs`.jsondataold,DATE_FORMAT(`logs`.currenttime,'%d/%m/%Y %h:%i %p') entrydatetime,`logs`.userip,l.name 'username' " +
                " FROM " + req.database_name + "_logs." + param.module + "_logs `logs`" +
                // " WHERE `logs`.`pkid`=? " +
                " INNER JOIN " + req.database_name + ".location_user l ON l.id = logs.userid " +
                " WHERE companyid= " + req.company_id + " AND locationid= " + req.location_id +
                " ORDER BY `logs`.currenttime DESC";
            sequelize.query(statement, { type: sequelize.QueryTypes.SELECT }).then(async (data) => {
                for (let i = 0; i < data.length; i++) {
                    // statement = "SELECT username FROM locations WHERE id = ? ";
                    // await sequelize.query(statement, { replacements: [req.location_id], type: sequelize.QueryTypes.SELECT }).then(async (username) => {
                    //for jsonData
                    if (data[i].jsondata) {
                        if (Object.keys(data[i].jsondata).length > 0) {
                            data[i].jsondata = JSON.parse(data[i].jsondata);
                            for (key in data[i].jsondata) {
                                if (typeof data[i].jsondata[key] == 'object') {
                                    data[i].jsondata[key] = String(JSON.stringify(data[i].jsondata[key]));
                                }
                            }
                        }
                    }
                    //for jsonDataOld
                    if (data[i].jsondataold) {
                        if (Object.keys(data[i].jsondataold).length > 0) {
                            data[i].jsondataold = JSON.parse(data[i].jsondataold);
                            for (key in data[i].jsondataold) {
                                if (typeof data[i].jsondataold[key] == 'object') {
                                    data[i].jsondataold[key] = String(JSON.stringify(data[i].jsondataold[key]));
                                }
                            }
                        }
                    }
                    data[i].jsondata = JSON.stringify(data[i].jsondata);
                    data[i].jsondataold = JSON.stringify(data[i].jsondataold);
                    data[i].userid = data[i].username;

                    // }).catch(function (e) {
                    //    
                    //     resolve(1);
                    // });
                }
                return res.send(success(data, "log"));
            }).catch(function (e) {
               
                resolve(1);
            });
        } else if (param.module == 'pass-import') {
            let statement = "SELECT `logs`.title,`logs`.jsondata,`logs`.jsondataold,DATE_FORMAT(`logs`.currenttime,'%d/%m/%Y %h:%i %p') entrydatetime,`logs`.userip,l.name 'username' " +
                " FROM " + req.database_name + "_logs.file_import_data_logs `logs`" +
                " INNER JOIN " + req.database_name + ".location_user l ON l.id = logs.userid " +
                " WHERE companyid= " + req.company_id + " AND locationid= " + req.location_id +
                " AND (`logs`.title LIKE '%import corporate data%' OR `logs`.title LIKE '%import third party vehicle data%') " +
                " ORDER BY `logs`.currenttime DESC";

            sequelize.query(statement, { type: sequelize.QueryTypes.SELECT }).then(async (data) => {
                for (let i = 0; i < data.length; i++) {
                    // statement = "SELECT username FROM locations WHERE id = ? ";
                    // await sequelize.query(statement, { replacements: [req.location_id], type: sequelize.QueryTypes.SELECT }).then(async (username) => {
                    //for jsonData
                    if (data[i].jsondata) {
                        if (Object.keys(data[i].jsondata).length > 0) {
                            data[i].jsondata = JSON.parse(data[i].jsondata);
                            for (key in data[i].jsondata) {
                                if (typeof data[i].jsondata[key] == 'object') {
                                    data[i].jsondata[key] = String(JSON.stringify(data[i].jsondata[key]));
                                }
                            }
                        }
                    }
                    //for jsonDataOld
                    if (data[i].jsondataold) {
                        if (Object.keys(data[i].jsondataold).length > 0) {
                            data[i].jsondataold = JSON.parse(data[i].jsondataold);
                            for (key in data[i].jsondataold) {
                                if (typeof data[i].jsondataold[key] == 'object') {
                                    data[i].jsondataold[key] = String(JSON.stringify(data[i].jsondataold[key]));
                                }
                            }
                        }
                    }
                    data[i].jsondata = JSON.stringify(data[i].jsondata);
                    data[i].jsondataold = JSON.stringify(data[i].jsondataold);
                    data[i].userid = data[i].username;
                    // }).catch(function (e) {
                    //    
                    //     resolve(1);
                    // });
                }
                return res.send(success(data, "log"));
            }).catch(function (e) {
               
                resolve(1);
            });
        } else {
            let statement = "SELECT `logs`.title,`logs`.jsondata,`logs`.jsondataold,DATE_FORMAT(`logs`.currenttime,'%d/%m/%Y %h:%i %p') entrydatetime,`logs`.userip,l.name 'username' " +
                " FROM " + req.database_name + "_logs." + param.module + "_logs `logs`" +
                " INNER JOIN " + req.database_name + ".location_user l ON l.id = logs.userid " +
                " WHERE `logs`.`pkid`= ? " +
                " ORDER BY `logs`.currenttime DESC";
            sequelize.query(statement, { replacements: [param.id], type: sequelize.QueryTypes.SELECT }).then(async (data) => {
                for (let i = 0; i < data.length; i++) {
                    // statement = "SELECT username FROM locations WHERE id = ? ";
                    // await sequelize.query(statement, { replacements: [req.location_id], type: sequelize.QueryTypes.SELECT }).then(async (username) => {
                    //for jsonData
                    if (data[i].jsondata) {
                        if (Object.keys(data[i].jsondata).length > 0) {
                            data[i].jsondata = JSON.parse(data[i].jsondata);
                            for (key in data[i].jsondata) {
                                if (typeof data[i].jsondata[key] == 'object') {
                                    data[i].jsondata[key] = String(JSON.stringify(data[i].jsondata[key]));
                                }
                            }
                        }
                    }
                    //for jsonDataOld
                    if (data[i].jsondataold) {
                        if (Object.keys(data[i].jsondataold).length > 0) {
                            data[i].jsondataold = JSON.parse(data[i].jsondataold);
                            for (key in data[i].jsondataold) {
                                if (typeof data[i].jsondataold[key] == 'object') {
                                    data[i].jsondataold[key] = String(JSON.stringify(data[i].jsondataold[key]));
                                }
                            }
                        }
                    }
                    data[i].jsondata = JSON.stringify(data[i].jsondata);
                    data[i].jsondataold = JSON.stringify(data[i].jsondataold);
                    data[i].userid = data[i].username;

                    // }).catch(function (e) {
                    //    
                    //     resolve(1);
                    // });
                }
                return res.send(success(data, "log"));
            }).catch(function (e) {
               
                resolve(1);
            });
        }
    }).catch(function (e) {
       
        resolve(1);
    })
};

exports.apiStatus = async (req, res) => {
    return res.send(success({}, "Success"));
}

exports.countries = async (req, res) => {   
    try {
        country.findAll().then((countries) => {
            return res.send((success(countries, "Countries List!")))
        }).catch((e) => {
            console.log(e)
            return res.send(error("Something went wrong!"))
        })
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}

exports.states = async (req, res) => {   
    let countryId = req.query?.c_id
    try {
        state.findAll({
            where : { country_id : countryId }
        }).then((states) => {
            return res.send((success(states, "States List!")))
        }).catch((e) => {
            return res.send(error("Something went wrong!"))
        })
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}

exports.cities = async (req, res) => {   
    let stateId = req.query?.s_id
    try {
        city.findAll({
            where : { state_id : stateId }
        }).then((cities) => {
            return res.send((success(cities, "Cities List!")))
        }).catch((e) => {
            console.log(e)
            return res.send(error("Something went wrong!"))
        })
    } catch (e) {
        console.log(e)
        return res.send(error(CONSTANTS.SERVER_ERROR))
    }
}

exports.organisations = async (req, res) => {   
    res.send(success({}, "Oraganisatoins List!"))
}

exports.lead_status = async (req, res) => {   
    res.send(success(setting.lead_status, "Lead status list!"))
}

exports.industries = async (req, res) => {   
    res.send(success(setting.industries, "Industries List!"))
}

exports.sources = async (req, res) => {   
    res.send(success(setting.sources, "Sources list!"))
}

exports.jobs = async (req, res) => {   
    res.send(success(setting.jobs, "Jobs list!"))
}

/**
 * 
 * @param {*} Model Sequelize model object
 * @param {*} hashcode id to match while fetching the record
 * @param {*} method findOne || count
 * @param {*} attributes which attributes to get
 * @returns {*} object : { valid: BOOLEAN, data: { attributes }, error: 'if Any' } 
 */
exports.findExists = async (Model, whereValue, type='hashcode', method='findOne', attributes=['id']) => {
    let respObj = {
        valid : false, 
        data : {},
        error : 'Something went wrong!'
    } 

    if(method!= 'findOne' && method!= 'count'){
        respObj.error = "Invalid method!"
        return respObj
    }
    if(type!= 'id' && type!= 'hashcode'){
        respObj.error = "Invalid where column!"
        return respObj
    }

    let whereCondition  = { hashcode: whereValue }

    if(type== 'id')
        whereCondition= { id: whereValue }
    try{
        await Model[method]({ 
            attributes: attributes,
            where: whereCondition 
        }).then((isExists) => {
            if(!!isExists){
                respObj.valid = true
                if(method == 'count'){
                    respObj.data.count = isExists
                } else {
                    respObj.data.id = isExists.dataValues.id
                }
                respObj.error= ''
            } else {
                console.log('Not Found!')
                respObj.error = 'Not Found!'
            }   
        }).catch((e)=> {
            respObj.error = e
            console.log(e)
        })
    } catch (e) {
        respObj.error = e
        console.log(e)
    }
    return respObj
}

exports.roles = async (req, res) => {   
    res.send(success("Roles list!",setting.roles))
}

exports.superAdminEntry = () => {
    try{
        staff.findOne({
            where: {
                id: 1
            }
        }).then((isIdExists)=> {
            if(isIdExists == null){
                try{
                    staff.create({
                        id: 1,
                        fname: "Super",
                        lname: "Admin",
                        email: "superadmin@mail.com",
                        gender: '0',
                        phone_no: "0000000000",
                        role_id : 0,
                        is_sub_admin: false,
                        address : "dummy address",
                        password: "12345678"
                    }).catch(e => {
                        console.log(e)
                    })
                } catch (e) {
                    console.log(e)
                }
            }
        }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        console.log('Super Admin entry failed!')
    }
}

/**
 * @description returns an array of where like condition
 * @param {*} colArray array with database table column's name
 * @param {*} searchValue value to be search 
 * @returns {*} [...] array with where object condition
 */
exports.getLikeObj= async (colArray, searchValue)=> {
    let whereLikeObj= []
    colArray.forEach((value, key)=>{
        whereLikeObj.push({[value]: {[Op.like]: `%${searchValue}%`}})
    })
    return whereLikeObj
}

exports.schedule_tasks_list = (req, res) => {
    res.send(success(setting.schedule_tasks,'Schedule task Lists!'))
}

exports.investments = (req, res) => {
    res.send(success(setting.investments,'Investmets Lists!'))
}
exports.frequency = (req, res) => {
    res.send(success(setting.frequency,'Frequency Lists!'))
}

exports.recurring_clean = (req, res)=> {
    res.send(success(setting.recurring_cleans,'Recurring Clean Lists!'))
}

exports.getLastCounter= async (Model, orderByField)=> {
    let respData = 0
    await Model.findOne({order: [[orderByField, 'DESC']]}).then((lastCounter)=>{
        if(lastCounter!=null)
            respData = lastCounter.dataValues[orderByField]
    })
    return respData
}

exports.getVal = (keyVal, objArr) => {
    let respObj = ''

    objArr.forEach((val, key) => {
        if(val.key == keyVal)
            respObj = objArr[key]
    })
    return respObj
}