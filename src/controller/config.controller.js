const { AppDataSource } = require("../data-source")
const { CreateSuccessResponse, CreateErrorResponse, } = require("../helpers/responseHelper")
const bcrypt = require('bcryptjs');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const ConfigRepository = AppDataSource.getRepository("Config");

exports.StoreConfig = async (req, res) => {
    try {

        const token = res.locals.token;
        const user = jwt.decode(token);
        const user_id = user.id
        const layersOrder = JSON.stringify(req.body.layersOrder)
        const growEditionSizeTo = req.body.growEditionSizeTo
        const created_at = Date.now()

        const data = await ConfigRepository.save({ growEditionSizeTo, layersOrder, user_id, created_at });

        return res
            .status(201)
            .send(
                CreateSuccessResponse(
                    `Data Store successfully`,
                    data
                )
            );

    } catch (error) {
        return res
            .status(500)
            .json(CreateErrorResponse("getConfig", `${error}`, "Something Went Wrong!!"));
    }
}