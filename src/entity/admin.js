var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
  name: "Admin",
  tableName: "admins",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    firstname: {
      type: "varchar",
    },
    lastname: {
      type: "varchar",
    },
    email: {
      type: "varchar",
      unique: true
    },
    password: {
      type: "varchar"
    },
    roles: {
      type: "varchar",
      default: "user"
    },
    is_active: {
      type: "boolean",
      default: false
    },
    created_at: {
      type: "varchar",
    }
  }
})