var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
  name: "config",
  tableName: "config",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    growEditionSizeTo: {
      type: "int",
    },
    user_id: {
      type: "int"
    },
    created_at: {
      type: "varchar",
    }
  },
})