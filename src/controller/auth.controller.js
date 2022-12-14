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

    if (adminData.is_active == false) {
      return res
        .status(401)
        .send(
          CreateErrorResponse(
            "Login",
            "You account is deactive by admin",
            "Blocked User"
          )
        );
    }

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
        .orderBy("user.id", 'ASC')
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

exports.deleteUser = async (req, res) => {
  const token = res.locals.token;
  const user = jwt.decode(token);
  let { id } = req.params;
  const status = req.body.status
  try {

    if (user.id === id) {
      return res.status(400).send(
        CreateSuccessResponse(`You can not block your self.`)
      );
    }

    const DeleteAdmin = await AdminRepository.createQueryBuilder()
      .update({ is_active: status })
      .where("id = :id", { id: id })
      .execute();

    return res.status(200).send(
      CreateSuccessResponse(`User ${status} successfully`, status)
    );
  } catch (error) {
    // return an error
    return res
      .status(500)
      .json(
        CreateErrorResponse("deleteUser", `${error}`, "Something Went Wrong!!")
      );
  }
}

exports.ChangePassword = async (req, res) => {
  const token = res.locals.token;
  const user = jwt.decode(token);
  try {
    let userData = await AdminRepository.find({
      where: { id: user.id },
    });

    const { old_password, new_password, confirm_password } = req.body;
    if (new_password != confirm_password) {
      return res
        .status(500)
        .send(
          CreateSuccessResponse(
            "New password and Confirm password is not matched!!!!."
          )
        );
    }
    let validUser = bcrypt.compareSync(old_password, userData[0].password);
    if (!validUser) {
      return res
        .status(404)
        .send(CreateSuccessResponse(`Old Password is wrong!!!`));
    }
    if (validUser) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPwd = bcrypt.hashSync(confirm_password, salt);
      await AdminRepository.createQueryBuilder()
        .update({
          password: hashedPwd,
        })
        .where("id = :id", { id: user.id })
        .execute();
      return res
        .status(201)
        .send(CreateSuccessResponse(`Password change successfully`));
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        CreateErrorResponse(
          "ChangePassword",
          `${error}`,
          "Something Went Wrong!!"
        )
      );
  }
};