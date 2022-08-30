const { AppDataSource } = require("../data-source")
const { CreateSuccessResponse, CreateErrorResponse, } = require("../helpers/responseHelper")
const basePath = process.cwd();
// const { startCreating, buildSetup } = require(`${basePath}/src/main.js`);
const { startCreating, buildSetup } = require("../main");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const fs = require("fs");
const buildDir = `${basePath}/build`;
const path = require('path')
const request = require('request')
const http = require('http')
const fetch = require('node-fetch');

exports.generateImage = async (req, res) => {

    try {
        const token = res.locals.token;
        const user = jwt.decode(token);
        let finalData = []

        startCreating(user);
        const folderName = `${buildDir}/images/user_${user.id}`;
        const data = fs.readdirSync(folderName)
            .filter((file) => fs.lstatSync(path.join(folderName, file)).isFile())
            .map((file) => (file))
        console.log("data", data);
        data.forEach((e, i) => {
            const data1 = `http://192.168.0.79:3005/build/images/user_${user.id}/` + e;
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
