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
        const token = res.locals.token;
        const user = jwt.decode(token);

        if (user.roles == "Admin") {
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
            .json(CreateErrorResponse("SaveLayer", `${error}`, "Something Went Wrong!!"));
    }
}

exports.getLayerTypes = async (req, res) => {
    try {
        const token = res.locals.token;
        const user = jwt.decode(token);

        if (user.roles == "Admin") {

            const ListOfLayers = await LayerTypeRepository.createQueryBuilder("layertype")
                .orderBy("layertype.sequence_id", 'ASC')
                .execute();

            ListOfLayers.forEach(e => {
                delete e.layertype_sequence_id;
            });
            return res
                .status(201)
                .send(
                    CreateSuccessResponse(
                        `List of layertypes`,
                        ListOfLayers
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
            .json(CreateErrorResponse("GetLayerTypes", `${error}`, "Something Went Wrong!!"));
    }
}

exports.updateLayer = async (req, res) => {
    try {
        const data = req.body;

        data.map(async (e, i) => {
            console.log(e.layertype_selected);
            await LayerTypeRepository.createQueryBuilder()
                .update()
                .set({ selected: e.layertype_selected, sequence_id: i })
                .where({ id: e.layertype_id })
                .execute();
        });

        return res
            .status(201)
            .send(
                CreateSuccessResponse(
                    `Layer type updated successfully`,
                )
            );

    } catch (error) {
        return res
            .status(500)
            .json(CreateErrorResponse("updateConfig", `${error}`, "Something Went Wrong!!"));
    }
}

exports.deleteLayer = async (req, res) => {
    try {
        const token = res.locals.token;
        const user = jwt.decode(token);
        const layertype_id = req.params.layertype_id;

        if (user.roles == "Admin") {

            const getLayerName = await LayerTypeRepository.findOne({
                where: { id: layertype_id }
            })

            const DeleteData = await LayerTypeRepository.createQueryBuilder()
                .delete()
                .where("id = :id", { id: layertype_id })
                .execute();

            const folderName = `${buildDir}/${getLayerName.name}`;
            if (fs.existsSync(folderName)) {
                fs.rmdirSync(folderName, {
                    recursive: true
                });
            }

            return res
                .status(201)
                .send(
                    CreateSuccessResponse(
                        `Delete Successfully`,
                        DeleteData
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
            .json(CreateErrorResponse("deleteLayer", `${error}`, "Something Went Wrong!!"));
    }
}