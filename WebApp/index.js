const express = require("express");
let path = require("path");
let app = express();
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.RDS_HOSTNAME || "localhost",
        user: process.env.RDS_USERNAME || "postgres",
        password: process.env.RDS_PASSWORD || "",
        database: process.env.RDS_DB_NAME || "",
        port: process.env.RDS_PORT || 5432,
        ssl: process.env.DB_SSL ? {rejectUnauthorized: false} : false
    }
});
require("./routes/routes")(app);
require("./routes/db_routes")(app, knex);
const PORT = process.env.PORT || 3000;
// My comments are different
app.listen(PORT, () => {console.log("Server Started Listening on Port: " + PORT);});