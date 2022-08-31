const express = require('express');
const basePath = process.cwd();
const { AppDataSource } = require("./src/data-source")
const app = express();
const PORT = 3005;
const cors = require('cors')
const mainRouter = require("./src/routes/index")
const path = require('path')
const { CreateSuccessResponse, CreateErrorResponse, } = require("./src/helpers/responseHelper")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const passport = require("passport")
const LocalStrategy = require("passport-local")
const AdminRepository = AppDataSource.getRepository("Admin");
const fs = require('fs')
const request = require('request')

AppDataSource.initialize()
    .then(async () => {
        console.log("Connected To Postgress");

        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS, PUT, PATCH, DELETE"
            );
            res.setHeader(
                "Access-Control-Allow-Headers",
                "X-Requested-With,content-type"
            );
            res.setHeader("Access-Control-Allow-Credentials", true);
            next();
        });
        app.use(cors({ origin: true, credentials: true }));

        app.use("/", mainRouter);
        app.use('/static', express.static(path.join(__dirname, 'Static Files')))
        app.use('/build', express.static(path.join(__dirname, 'build')))
        app.set('view engine', 'ejs');



        

        // app.get("/home", function (req, res) {
        //     res.render("home", {

        //     });
        // });

        // app.get("/login", function (req, res) {
        //     res.render("login");
        // });

        // app.post("/login", async function (req, res) {
        //     try {
        //         const userData = AdminRepository.createQueryBuilder("admin");

        //         userData.where({
        //             email: req.body.email,
        //         });
        //         const adminData = await userData.getOne();

        //         if (adminData == null) {
        //             return res
        //                 .status(500)
        //                 .send(
        //                     CreateErrorResponse(
        //                         "Login",
        //                         `Login failed!! Please enter correct email`,
        //                         "Invalid Email!"
        //                     )
        //                 );
        //         }
        //         if (adminData) {
        //             let validUser = bcrypt.compareSync(req.body.password, adminData.password);
        //             const token = jwt.sign(
        //                 { id: adminData.id?.toString(), email: adminData.email },
        //                 process.env.SECRET_KEY,
        //                 {
        //                     expiresIn: "2 days",
        //                 }
        //             );
        //             adminData["token"] = token;
        //             delete adminData["password"];
        //             if (validUser) {
        //                 return res
        //                     .status(200)
        //                     .redirect('/home')
        //                     .send(CreateSuccessResponse(`Login successfully`, adminData));

        //             }
        //             if (!validUser) {
        //                 return res
        //                     .status(500)
        //                     .send(
        //                         CreateErrorResponse(
        //                             "Login",
        //                             `Login failed!! Please enter correct password and email`,
        //                             "Invalid Credentials"
        //                         )
        //                     );
        //             }
        //         }
        //     } catch (error) {
        //         return res
        //             .status(500)
        //             .json(CreateErrorResponse("Login", `${error}`, "Something Went Wrong!!"));
        //     }
        // });

        // app.get("/signup", function (req, res) {
        //     res.render("signup");
        // });

        // app.post("/signup", async function (req, res) {
        //     try {
        //         const newAdminUser = req.body;
        //         const salt = bcrypt.genSaltSync(10);
        //         const hashedPwd = bcrypt.hashSync(req.body.password, salt);
        //         newAdminUser.password = hashedPwd;
        //         newAdminUser.created_at = Date.now()
        //         const AdminData = await AdminRepository.save(newAdminUser);
        //         return res
        //             .status(201)
        //             .redirect('/home')
        //             .send(
        //                 CreateSuccessResponse(
        //                     `Admin with email ${newAdminUser.email} is registered successfully`,
        //                     AdminData
        //                 )
        //             );
        //     } catch (error) {
        //         return res
        //             .status(500)
        //             .json(
        //                 CreateErrorResponse("SignUp", `${error}`, "Something Went Wrong!!")
        //             );
        //     }
        // });


        app.listen(PORT, (error) => {
            if (!error)
                console.log("Server is Successfully Running,and App is listening on port " + PORT)
            else
                console.log("Error occurred, server can't start", error);
        }
        );

    })
    .catch((error) => console.log(error));


