/*
Views (GET):
    Public:
        /
        /tableau
        /survey
        /login
        /signUp
    Employee (Available after successful login):
        /employee/index
        /employee/tableau
        /employee/survey
        /employee/data
        /employee/account
    Admin (Available after successful admin login):
        /admin/index
        /admin/tableau
        /admin/survey
        /admin/data
        /admin/analytics
        /admin/elevate
        /admin/account
*/
/*
Actions:
    TBD
*/
/*
API:
    TBD
*/
/*
For each view:
    - POST for accessing like an href
    - GET only used for accessing from external requests
        - Views that require a logged-in user are redirected to login
    - RoutePath should be the desired page's path
*/
/*
For each action:
    - POST for submitting an action
*/
module.exports = (app, knex) => {
    const bcrypt = require("bcrypt");
    function createEmployee(username, password, first_name, last_name, city_id, is_admin) {
        bcrypt.hash(password, 10, (err, hash) => {
            knex("employees").insert({
                "username": username,
                "hash": hash,
                "first_name": first_name,
                "last_name": last_name,
                "city_id": city_id,
                "is_admin": is_admin
            }).then(employees => {
                return employees
            });
        });
    };
    {//Public Views
    // Landing
    app.get("/", (req, res) => {
        res.render("index");
    });
    // Tableau
    app.get("/tableau", (req, res) => {
        res.render("tableau");
    });
    // Take a Survey
    app.get("/survey", (req, res) => {
        res.render("survey");
    });
    // Employee Login
    app.get("/login", (req, res) => {
        res.render("login");
    });
    // Employee Signup
    app.get("/signUp", (req, res) => {
        res.render("signUp", {"params": {"usernames": [usernames]}});
    });
};
    {//Employee Views
    // Landing
    app.get("/employee/index", (req, res) => {
        res.render("employee/index");
    });
    // Tableau
    app.get("/employee/tableau", (req, res) => {
        res.render("employee/tableau");
    });
    // Take a Survey
    app.get("/employee/survey", (req, res) => {
        res.render("employee/survey");
    });
    // View Raw Data
    app.get("/employee/data", (req, res) => {
        res.render("employee/data");
    });
    // Edit Account Info
    app.get("/employee/account", (req, res) => {
        res.render("employee/account");
    });};
    {//Admin Views
    // Landing
    app.get("/admin/index", (req, res) => {
        res.render("admin/index");
    });
    // Tableau
    app.get("/admin/tableau", (req, res) => {
        res.render("admin/tableau");
    });
    // Take a Survey
    app.get("/admin/survey", (req, res) => {
        res.render("admin/survey");
    });
    // View/Edit Raw Data
    app.get("/admin/data", (req, res) => {
        res.render("admin/data");
    });
    // View Google Analytics
    app.get("/admin/analytics", (req, res) => {
        res.render("admin/analytics");
    });
    // Elevate employee accounts
    app.get("/admin/elevate", (req, res) => {
        res.render("admin/elevate");
    });
    // Edit Account Info
    app.get("/admin/account", (req, res) => {
        res.render("admin/account");
    });};
    {//CRUD Actions
    app.post("/submitSignUp", (req, res) => {
        knex.schema.createTableIfNotExists("employees", table => {
            table.string("username", 60).primary().notNullable();
            table.binary("hash").notNullable();
            table.string("first_name", 30).notNullable();
            table.string("last_name", 30).notNullable();
            table.string("city_id", 60).notNullable();
            table.boolean("is_admin").notNullable();
        }).then(employees => {
            knex("employees").then(employees => {
                if (employees.length == 0) {
                    let email = "admin@provocity.com";
                    let password = "CHANGEME123!";
                    let first_name = "DEFAULT";
                    let last_name = "ADMIN";
                    let city_id = "CHANGEME123!";
                    let is_admin = true;
                    createEmployee(email, password, first_name, last_name, city_id, is_admin);
                };
                let email = req.body.workEmail;
                let password = req.body.password;
                let first_name = req.body.employeeFirstName;
                let last_name = req.body.employeeLastName;
                let city_id = req.body.employeeId;
                let is_admin = false;
                createEmployee(email, password, first_name, last_name, city_id, is_admin);
                res.render("/login");
            });
        });
    });
    app.post("/submitLogin", (req, res) => {
        req.body.workEmail
        req.body.password
        res.render("/employee/index")
    });
    app.get("/testThis", (req, res) => {
        res.send("");
    });
    };
    {//API Actions
    };
};