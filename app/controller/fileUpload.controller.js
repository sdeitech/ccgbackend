const envCon = process.env
const common = require('../controller/common.controller')
const constants = require('../assets/constants')
const fs = require('fs')

exports.upload = async(image_url, old_image_url, folderName = '') => {
    return new Promise(async function(resolve, reject) {
        let respObj = {
            valid: false,
            url: ''
        }
        let allowedExtensions = ['jpg', 'png', 'pdf', 'jpeg', 'csv']
        let decodedImg = common.decodeBase64Image(image_url)
        const rename = await generateName(25)
        let ext = decodedImg.ext
        if(allowedExtensions.includes(ext)){
            folderName = folderName != '' ? (folderName + '/') : ''
            let name = '' + folderName + '' + rename + '.' + ext
            let s3url = "" + folderName + "" + name
            // let s3url = await s3UrlGenerater(envCon.bucketName, name)
            console.log(s3url + "s3url");
            console.log(name + "name");
            console.log(folderName + "folderName");
            const params = {
                Bucket: envCon.bucketName,
                Key: s3url, // type is not required
                Body: decodedImg.data,
                ACL: 'public-read',
                ContentEncoding: 'base64', // required
                ContentType: decodedImg.type // required. Notice the back ticks
            }  
            console.log(params);

            try {
                const { Location, Key } = await s3.upload(params).promise()
                respObj.valid = true
                respObj.url = Location
                resolve(respObj)
                
                if(Location.length > 0){
                    if(old_image_url != '' && old_image_url != null && old_image_url != undefined ){
                        try{
                            deleteS3Object(old_image_url,folderName)
                        }catch(e){
                            console.log('Error While Deleting File S3')
                        }
                    }
                }
            } catch (error) {
                respObj.error = error
                reject(error)
            }  
        } else {
            respObj.error = 'File type not supported!'
            reject(respObj)
        }
    })
}

const generateName = (lngth) => {
    return new Promise(function(resolve, reject) {
        let text = ''
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

        for (let i = 0; i < lngth; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        if (text != '')
            resolve(text)
        else
            reject(lngth)
    })
}

const s3UrlGenerater = (bucketName = '', fileName = '') => {
    let s3region = envCon.S3REGION
    if (typeof bucketName != 'undefined' && bucketName != '' && bucketName != null && typeof s3region != 'undefined' && s3region != '' && s3region != null && typeof fileName != 'undefined' && fileName != '' && fileName != null) {

        let s3Url = (typeof constants.S3URL != 'undefined' && constants.S3URL != '' && constants.S3URL != null) ? constants.S3URL : ''
        if (s3Url != '') {
            s3Url = s3Url.replace('BUCKET_NAME', bucketName)
            s3Url = s3Url.replace('REGION', s3region)
            s3Url = s3Url.replace('FILENAME', fileName)
            return s3Url
        } else {
            return ''
        }
    } else {
        return ''
    }
}

const deleteS3Object = (url,folderName) => {
    url = fileNameExtrator(url)

    s3.deleteObject({ Bucket: envCon.bucketName, Key: ((folderName != '' || folderName != null ) ? folderName+'/'+url : url )}, (err, data) => {
        console.error(err)
        console.log(data)
    })

}

const fileNameExtrator = (url) => {
    let fileName = new URL(url,'https://test.com').href.split('#').shift().split('?').shift().split('/').pop()
    return fileName
}

// exports.upload = async (newImage, oldImageUrl, folderName) => {
//     let respObj = {
//         valid: false,
//         url: ''
//     }
//     let allowedExtensions = ['jpg', 'png', 'pdf', 'jpeg']
//     try{
//         if(!fs.existsSync(`./public/${folderName}`))
//             fs.mkdirSync(`./public/${folderName}`)
            
//         if (newImage && Object.keys(newImage).length > 0 && Object.getPrototypeOf(newImage) === Object.prototype) {
//             let decodedImg = common.decodeBase64Image(newImage)
//             let imageBuffer = decodedImg.data
//             let type = decodedImg.type
//             let ext = decodedImg.ext
//             // let ext = mime.extension(type)
//             if(allowedExtensions.includes(ext)){
//                 let fileName = `/public/${folderName}/${folderName}_${Date.now()}.${ext}`
//                 fs.writeFileSync(`.${fileName}`, imageBuffer, 'utf8')
//                 if(!!oldImageUrl){
//                     fs.unlink(`.${oldImageUrl}`, ()=>{})
//                 }
//                 respObj.valid = true
//                 respObj.url = fileName
//             } else {
//                 respObj.error = 'File type not supported!'
//             }   
//         }  
//     } catch(e){
//         respObj.error = e
//     }
//     return respObj
// }

// var upload = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: 'some-bucket',
//       acl: 'public-read',
//       contentDisposition: 'attachment',
//       key: function (req, file, cb) {
//         cb(null, Date.now().toString())
//       }
//     })
// })

// if (obj && Object.keys(obj).length > 0 &&
//     Object.getPrototypeOf(obj) === Object.prototype) {
//     let decodedImg = common.decodeBase64Image(param.image_url)
//     let imageBuffer = decodedImg.data
//     let type = decodedImg.type
//     let extension = mime.extension(type)
//     fileName = 'image_' + Date.now() + '.' + extension
//     insertData.image = fileName
//     fs.writeFileSync('./public/uploads/' + fileName, imageBuffer, 'utf8')
// }