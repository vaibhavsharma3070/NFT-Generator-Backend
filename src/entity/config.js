var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
  name: "Config",
  tableName: "config",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    growEditionSizeTo: {
      type: "varchar",
    },
    layersOrder: {
      type: "varchar",
    },
    user_id:{
      type:"int"
    },
    created_at: {
      type: "varchar",
    }
  },
  relations: {
    categories: {
        target: "admins",
        type: "one-to-one",
        joinTable: true,
        cascade: true,
    },
},
})