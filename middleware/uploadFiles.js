const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination : './public/files',
    filename :(req, file, callback) => 
    {
        let ext = path.extname(file.originalname);
        let doc = file.originalname.split('.').slice(0, -1).join('.');
        let file_Name = doc + "-" + Date.now() + ext;

        callback(null, file_Name);
    }
});

var docFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(mp3)$/)){
        return cb(newError("You can upload only files!"), false);
    }
    cb(null, true);
};

var upload = multer({
    storage: storage,
    fileFilter: docFileFilter,
    limits: { fileSize: 100000000 }
}).array('file', 1);

 

module.exports = upload