const { AppDataSource } = require("../data-source")
const { CreateSuccessResponse, CreateErrorResponse, } = require("../helpers/responseHelper")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const AdminRepository = AppDataSource.getRepository("Admin");

exports.Login = async (req, res) => {
  try {
    const userData = AdminRepository.createQueryBuilder("admin");

    userData.where({
      email: req.body.email,
    });
    const adminData = await userData.getOne();

    if (adminData == null) {
      return res
        .status(500)
        .send(
          CreateErrorResponse(
            "Login",
            `Login failed!! Please enter correct email`,
            "Invalid Email!"
          )
        );
    }
    if (adminData) {
      let validUser = bcrypt.compareSync(req.body.password, adminData.password);
      const token = jwt.sign(
        { id: adminData.id?.toString(), email: adminData.email },
        process.env.SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      adminData["token"] = token;
      delete adminData["password"];
      if (validUser) {
        buildSetup(adminData);
        return res
          .status(200)
          .send(CreateSuccessResponse(`Login successfully`, adminData));
      }
      if (!validUser) {
        return res
          .status(500)
          .send(
            CreateErrorResponse(
              "Login",
              `Login failed!! Please enter correct password and email`,
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

exports.SignUp = async (req, res) => {
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
