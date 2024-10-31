let models = require("./models")
models.sequelize.sync().then(() => {
    console.log("data tables created successfully.")
})
