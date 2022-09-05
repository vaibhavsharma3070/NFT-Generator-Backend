const { AppDataSource } = require("../data-source")
const { CreateSuccessResponse, CreateErrorResponse, } = require("../helpers/responseHelper")
const bcrypt = require('bcryptjs');
require("dotenv").config();
const jwt = require('jsonwebtoken');
var fs = require('fs');
const LayerTypeRepository = AppDataSource.getRepository("layertype");
const basePath = process.cwd();
const buildDir = `${basePath}/layers`;
const { getConnection, In } = require("typeorm");

exports.saveLayer = async (req, res) => {
    try {
        const name = req.body.name
        const data = await LayerTypeRepository.save({ name });

        const jsonFolderName = `${buildDir}/${name}`;

        if (!fs.existsSync(jsonFolderName)) {
            fs.mkdirSync(jsonFolderName, {
                recursive: true
            });
        }

        return res
            .status(201)
            .send(
                CreateSuccessResponse(
                    `Layer Insert successfully`,
                    data
                )
            );
    } catch (error) {
        return res
            .status(500)
            .json(CreateErrorResponse("SaveLayer", `${error}`, "Something Went Wrong!!"));
    }
}

exports.getLayerTypes = async (req, res) => {
    try {
        const ListOfLayers = await LayerTypeRepository.createQueryBuilder()
            .execute();
        return res
            .status(201)
            .send(
                CreateSuccessResponse(
                    `List of layertypes`,
                    ListOfLayers
                )
            );
    } catch (error) {
        return res
            .status(500)
            .json(CreateErrorResponse("GetLayerTypes", `${error}`, "Something Went Wrong!!"));
    }
}

exports.updateLayer = async (req, res) => {
    try {
        const status = req.body.status;
        const id = JSON.parse(req.body.id);

        const layerTypeData = await LayerTypeRepository.createQueryBuilder()
            .update()
            .set({ selected: status })
            .where({ id: In(id) })
            .execute();

        return res
            .status(201)
            .send(
                CreateSuccessResponse(
                    `Layer type updated successfully`,
                    layerTypeData
                )
            );

    } catch (error) {
        console.log("error", error);
        return res
            .status(500)
            .json(CreateErrorResponse("updateConfig", `${error}`, "Something Went Wrong!!"));
    }
}