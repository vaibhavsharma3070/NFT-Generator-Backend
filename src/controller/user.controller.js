const { CreateSuccessResponse, CreateErrorResponse, } = require("../helpers/responseHelper")
const basePath = process.cwd();
const { startCreating, buildSetup } = require("../main");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const fs = require("fs");
const buildDir = `${basePath}/build`;
const path = require('path')
const multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.readdir('./build/images/', (err, files) => {
            if (err)
              console.log(err);
            else {
              if(files.length === 0){
                cb({msg:"No user images found"});
              }
              else{
                files.forEach(file => {
                    // if (!fs.existsSync("./build/images/")) {
                    //     fs.mkdirSync("./build/images/")
                    // }
                    cb(null, "./build/images/"+file);
                })
              }
            }
          })
       
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now()+".jpg")
    }
  });
//   const maxSize = 1 * 1000 * 1000;
var upload = multer({ 
    storage: storage,
    // limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){
    
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      } 
  
}).array("uploaded_file");  

exports.generateImage = async (req, res) => {

    try {
        const token = res.locals.token;
        const user = jwt.decode(token);
        let finalData = []

        const folderName = `${buildDir}/images/user_${user.id}`;
        const data = fs.readdirSync(folderName)
            .filter((file) => fs.lstatSync(path.join(folderName, file)).isFile())
            .map((file) => (file))
        console.log("data", data);
        data.forEach((e, i) => {
            const data1 = `http://${process.env.IP_ADDRESS}:${process.env.PORT}/build/images/user_${user.id}/` + e;
            finalData.push(data1)
        });

        return res
            .status(201)
            .send(
                CreateSuccessResponse(
                    `Generate successfully`, finalData
                )
            );
    } catch (error) {
        return res
            .status(500)
            .send(
                CreateErrorResponse("generateImage", `${error}`, "Something Went Wrong!!")
            );
    }
}
exports.storeImage = async (req, res) => {

    try {
          upload(req,res,function(err) {
           
            if(err) {
      
                // ERROR occurred (here it can be occurred due
                // to uploading image of size greater than
                // 1MB or uploading different file type)
                res.send(err)
                // res.send({res:'0',msg:err.msg})

            }
            else {
      
                // SUCCESS, image successfully uploaded
                res.send({res:'1',msg:"Success, Image uploaded!"})
            }
        })
         
    } catch (error) {
        return res
            .status(500)
            .send(
                CreateErrorResponse("generateImage", `${error}`, "Something Went Wrong!!")
            );
    }
}
