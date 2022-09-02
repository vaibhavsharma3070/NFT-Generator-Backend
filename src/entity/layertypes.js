var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "layertype",
    tableName: "layertype",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
        selected: {
            type: "boolean",
            default: true
        }
    }
})