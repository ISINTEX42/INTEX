const express = require("express");
let path = require("path");
let app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("bootstrap"));
app.set("view engine", "ejs");
const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.RDS_HOSTNAME || "localhost",
        user: process.env.RDS_USERNAME || "postgres",
        password: process.env.RDS_PASSWORD || "q1w2e3r4t5",
        database: process.env.RDS_DB_NAME || "mindfulmediasurvey",
        port: process.env.RDS_PORT || 5432,
        ssl: process.env.DB_SSL ? {rejectUnauthorized: false} : false
    }
});
require("./routes/routes")(app, knex);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {console.log("Server Started Listening on Port: " + PORT);});
