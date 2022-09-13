const { CreateSuccessResponse, CreateErrorResponse, } = require("../helpers/responseHelper")
const basePath = process.cwd();
const { startCreating, buildSetup } = require("../main");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const fs = require("fs");
const buildDir = `${basePath}/build`;
const path = require('path')
const multer = require('multer')
const { AppDataSource } = require("../data-source")
const LayerTypeRepository = AppDataSource.getRepository("layertype");
const layersDir = `${basePath}/layers`;
const { layerConfigurations } = require(`${basePath}/src/config.js`);
const { getElements } = require("../main");

let rarityData = [];
let finalData = []
let finalTraitsData = []
var storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        fs.readdir('./layers', async (err, files) => {
            let data = []
            if (err)
                console.log(err);
            else {
                if (files.length === 0) {
                    cb({ msg: "No user images found" });
                }
                else {
                    const ListOfLayers = await LayerTypeRepository.createQueryBuilder("layer")
                        .orderBy('layer.id', 'DESC')
                        .limit(1)
                        .execute();
                    const file = ListOfLayers[0].layer_name
                    console.log(file);
                    // ListOfLayers.map((e) => {
                    //     if (e.layertype_selected == true) {
                    //         data.push(e.layertype_name)
                    //     }
                    // })

                    // data.forEach(file => {
                    //     // if (!fs.existsSync("./build/images/")) {
                    //     //     fs.mkdirSync("./build/images/")
                    //     // }
                    cb(null, "./layers/" + file);
                    // })
                }
            }
        })

    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + ".jpg")
    }
});
//   const maxSize = 1 * 1000 * 1000;
var upload = multer({
    storage: storage,
    // limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {

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

        Promise.resolve()
            .then(async () => {

                buildSetup(user);
                startCreating(user);

            }).then(async () => {
                setTimeout(async () => {
                    let rawdata = fs.readFileSync(`${basePath}/build/json/user_${user.id}/_metadata.json`);
                    let data = JSON.parse(rawdata);
                    let editionSize = data.length;

                    const layerConfigurationsData = await layerConfigurations();

                    layerConfigurationsData.forEach((config) => {
                        let layers = config.layersOrder;

                        layers.forEach((layer) => {
                            let elementsForLayer = [];
                            let elements = getElements(`${layersDir}/${layer.name}/`);
                            elements.forEach((element) => {
                                let rarityDataElement = {
                                    trait: element.name,
                                    weight: element.weight.toFixed(0),
                                    occurrence: 0,
                                };
                                elementsForLayer.push(rarityDataElement);
                            });
                            let layerName =
                                layer.options?.["displayName"] != undefined
                                    ? layer.options?.["displayName"]
                                    : layer.name;
                            if (!rarityData.includes(layer.name)) {
                                rarityData[layerName] = elementsForLayer;
                            }
                        });
                    });

                    data.forEach((element) => {
                        let attributes = element.attributes;
                        attributes.forEach((attribute) => {
                            let traitType = attribute.trait_type;
                            let value = attribute.value;

                            let rarityDataTraits = rarityData[traitType];
                            rarityDataTraits.forEach((rarityDataTrait) => {
                                if (rarityDataTrait.trait == value) {
                                    rarityDataTrait.occurrence++;
                                }
                            });
                        });
                    });

                    for (var layer in rarityData) {
                        for (var attribute in rarityData[layer]) {
                            let chance =
                                ((rarityData[layer][attribute].occurrence / editionSize) * 100).toFixed(2);

                            rarityData[layer][attribute].occurrence =
                                `${rarityData[layer][attribute].occurrence} in ${editionSize} editions (${chance} %)`;
                        }
                    }

                    for (var layer in rarityData) {
                        for (var trait in rarityData[layer]) {
                            finalTraitsData.push(rarityData[layer][trait])
                        }
                    }
                }, 1000)
            }).then(() => {
                fs.writeFileSync(
                    `${buildDir}/json/user_${user.id}/_traitjson.json`,
                    JSON.stringify(finalTraitsData, null, 2)
                );
                finalTraitsData.length = 0;

            }).then(() => {
                setTimeout(() => {
                    const folderName = `${buildDir}/images/user_${user.id}`;
                    const jsonFolderName = `${buildDir}/json/user_${user.id}`;
                    const data = fs.readdirSync(folderName)
                        .filter((file) => fs.lstatSync(path.join(folderName, file)).isFile())
                        .map((file) => (file))

                    const jsonData = fs.readdirSync(jsonFolderName)
                        .filter((file) => fs.lstatSync(path.join(jsonFolderName, file)).isFile())
                        .map((file) => (file))
                    jsonData.forEach((e, i) => {
                        const data2 = `${process.env.IP_ADDRESS}/build/json/user_${user.id}/` + e;
                        finalData.push(data2)
                    });
                    data.forEach((e, i) => {
                        const data1 = `${process.env.IP_ADDRESS}/build/images/user_${user.id}/` + e;
                        finalData.push(data1)
                    })
                }, 1000)

            }).then(() => {
                setTimeout(() => {
                    return res
                        .status(201)
                        .send(
                            CreateSuccessResponse(
                                `Generate successfully`, finalData
                            )
                        );
                }, 1000)

            }).then(() => {
                setTimeout(() => {
                    const deleteExists = (user) => {
                        const folderName = `${buildDir}/images/user_${user.id}`;
                        const jsonFolderName = `${buildDir}/json/user_${user.id}`;
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
                    finalData.length = 0;
                    deleteExists(user)
                }, 2000)

            });
    } catch (error) {
        return res
            .status(500)
            .send(
                CreateErrorResponse("generateImage", `${error}`, "Something Went Wrong!!")
            );
    }
}
exports.storeImage = async (req, res) => {
    const token = res.locals.token;
    const user = jwt.decode(token);
    try {
        if (user.roles == "Admin") {
            upload(req, res, function (err) {

                if (err) {

                    // ERROR occurred (here it can be occurred due
                    // to uploading image of size greater than
                    // 1MB or uploading different file type)
                    return res
                        .status(500)
                        .send(
                            CreateErrorResponse("storeImage", `${err}`, "Something Went Wrong!!")
                        );
                    // res.send({res:'0',msg:err.msg})

                }
                else {

                    // SUCCESS, image successfully uploaded
                    return res
                        .status(201)
                        .send(
                            CreateSuccessResponse(
                                `Image store successfully`
                            )
                        );
                }
            })
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
            .send(
                CreateErrorResponse("generateImage", `${error}`, "Something Went Wrong!!")
            );
    }
}
