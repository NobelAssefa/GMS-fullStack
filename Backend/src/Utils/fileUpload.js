const multer =require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "uploads")
    },
    filename:function (req,file,cb){
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

//specify the file format that can be saved
const filterFile = function (req,file,cb){
   if(
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
   ){
    cb(null,true)
   }else{
    cb(null,false)
   }
}



const upload = multer({storage,filterFile,  limits: { fileSize: 5 * 1024 * 1024 } // Limit set to 5MB
})


//file size formatter

const fileSizeFormatter = (bytes,decimal) => {
    if(bytes === 0){
        return "0 bytes";
    }

    const dm = decimal || 2;
    const sizes =["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"]
    const index = Math.floor(Math.log(bytes)/Math.log(1000))
    return (
        parseFloat((bytes/Math.pow(1000,index)).toFixed(dm))+ "" + sizes[index]
    )
}

module.exports = {upload, fileSizeFormatter}