const { AppDataSource } = require("../data-source")
const { CreateSuccessResponse, CreateErrorResponse, } = require("../helpers/responseHelper")
const bcrypt = require('bcryptjs');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const ConfigRepository = AppDataSource.getRepository("Config");

exports.getConfig = async (req, res) => {
    try {
        const config = await ConfigRepository.createQueryBuilder()
            .select()
            .execute();

        return res
            .status(201)
            .send(
                CreateSuccessResponse(
                    `Data fetched successfully`,
                    config
                )
            );

    } catch (error) {
        console.log("error", error);
        return res
            .status(500)
            .json(CreateErrorResponse("getConfig", `${error}`, "Something Went Wrong!!"));
    }
}

exports.updateConfig = async (req, res) => {
    try {

        const numOfEdition = req.body.number

        const configData = await ConfigRepository.createQueryBuilder()
            .update({ growEditionSizeTo: numOfEdition })
            .where("id = :id", { id: 1 })
            .execute();

        return res
            .status(201)
            .send(
                CreateSuccessResponse(
                    ` Image length updated to ${numOfEdition} successfully`,
                    configData
                )
            );

    } catch (error) {
        console.log("error", error);
        return res
            .status(500)
            .json(CreateErrorResponse("updateConfig", `${error}`, "Something Went Wrong!!"));
    }
}