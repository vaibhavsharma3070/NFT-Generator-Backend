const { AppDataSource } = require("../data-source")
const { CreateSuccessResponse, CreateErrorResponse, } = require("../helpers/responseHelper")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { startCreating, buildSetup } = require("../main");
const basePath = process.cwd();
const buildDir = `${basePath}/build`;
var fs = require('fs');

const AdminRepository = AppDataSource.getRepository("Admin");

exports.login = async (req, res) => {
  try {
    const userData = AdminRepository.createQueryBuilder("admin");

    userData.where({
      email: req.body.email,
    });
    const adminData = await userData.getOne();

    if (adminData == null) {
      return res
        .status(401)
        .send(
          CreateErrorResponse(
            "Login",
            "Invalid email id or password! Please try again.",
            "User not found"
          )
        );
    }
    if (adminData) {
      let validUser = bcrypt.compareSync(req.body.password, adminData.password);
      const token = jwt.sign(
        { id: adminData.id?.toString(), email: adminData.email, roles: adminData.roles },
        process.env.SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      adminData["token"] = token;
      delete adminData["password"];
      if (validUser) {

        const deleteExists = (adminData) => {
          const folderName = `${buildDir}/images/user_${adminData.id}`;
          const jsonFolderName = `${buildDir}/json/user_${adminData.id}`;
          if (fs.existsSync(jsonFolderName)) {
            fs.rmdirSync(jsonFolderName, {
              recursive: true
            });
          }
          if (fs.existsSync(folderName)) {
            fs.rmdirSync(folderName, {
              recursive: true
            });
          }
        };

        deleteExists(adminData)

        return res
          .status(200)
          .send(CreateSuccessResponse(`Login successfully`, adminData));
      }
      if (!validUser) {
        return res
          .status(401)
          .send(
            CreateErrorResponse(
              "Login",
              "Invalid email id or password! Please try again.",
              "Invalid Credentials"
            )
          );
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json(CreateErrorResponse("Login", `${error}`, "Something Went Wrong!!"));
  }
};

exports.signUp = async (req, res) => {
  try {
    const newAdminUser = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPwd = bcrypt.hashSync(req.body.password, salt);
    newAdminUser.password = hashedPwd;
    newAdminUser.created_at = Date.now()
    const AdminData = await AdminRepository.save(newAdminUser);
    if (AdminData) {
      return res
        .status(201)
        .send(
          CreateSuccessResponse(
            `Admin with email ${newAdminUser.email} is registered successfully`,
            AdminData
          )
        );
    }

  } catch (error) {
    return res
      .status(500)
      .json(
        CreateErrorResponse("SignUp", `${error}`, "Something Went Wrong!!")
      );
  }
};

exports.listOfUser = async (req, res) => {
  try {
    const token = res.locals.token;
    const user = jwt.decode(token);

    if (user.roles == "Admin") {

      const listOfUser = await AdminRepository.createQueryBuilder("user")
        .select(["user.id", "user.firstname", "user.lastname", "user.email", "user.roles", "user.is_active", "user.created_at"])
        .execute();


      return res
        .status(201)
        .send(
          CreateSuccessResponse(
            `List of Users`,
            listOfUser
          )
        );
    } else {
      return res
        .status(401)
        .send(
          "Unauthorized Access"
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(CreateErrorResponse("listOfUser", `${error}`, "Something Went Wrong!!"));
  }
}