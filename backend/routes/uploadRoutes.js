import path from 'path'
import express from 'express'
import multer from 'multer'
const router = express.Router()

//Give a config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')  //null - no error, second argument is the destination where we want to upload
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`) //path.extname - gets the extension from the filename
    }
})

function checkFileType(file, cb) {  //To validate the type of images through the extensions 
    //Expression with file types that we want
    const filetypes = /jpg|jpeg|png/  
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())  //This will give us a true/false value
    //Take the expression 'filetypes' & test it against the extension for the file name that is passed in
    const mimetype = filetypes.test(file.mimetype)  //This will give us a true/false value
    //It has to have a mimetype out of the three: jpg, jpeg, png as mentioned above in 'filetypes'
    //Every file has a mimetype: like a jpeg is image/jpeg

// Examples:
// text/html - HTML document (webpage)
// text/css - CSS file
// text/javascript - JavaScript file
// image/jpeg - JPEG image file
// image/png - PNG image file
// audio/wav - WAVE audio file
// video/mp4 - MPEG video file
// application/zip - ZIP compressed archive

    if(extname && mimetype) {
        return cb(null, true)
    } else {
        cb('Images Only!')  //Passing in Error
    }
}

//What we are going to pass in as middleware to our route
const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {  //To upload only particular file types
        checkFileType(file, cb)
    }
})

router.post('/', upload.single('Image'), (req, res) => { //For uploading only a single image
    //'upload' - middleware passed in
    //When we upload on frontend, just remember to call 'Image'
    res.send(`/${req.file.path}`)  //Returning the path of that file to frontend - ProductEditScreen.js where we setImage(data)
}) 

export default router