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
        /admin/viewSurvey
        /admin/editSurvey
        /admin/analytics
        /admin/employees
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
    function verifyAdmin(referer) {
        if (referer === undefined) {
            return false;
        } else {
            let validRequest = false;
            let regexs = [
                new RegExp('http[s]?:\/\/mindfulmediasurvey\.com\/admin\/'),
                new RegExp('http[s]?:\/\/localhost:3000\/admin\/')
            ];
            regexs.forEach((regex) => {
                if (regex.test(referer)) {
                    validRequest = true;
                    return;
                };
            });
            if (validRequest) {
                return true;
            } else {
                return false;
            };
        };
        return false;
    };
    function verifyEmployee(referer) {
        if (referer === undefined) {
            return false;
        } else {
            let validRequest = false;
            let regexs = [
                new RegExp('http[s]?:\/\/mindfulmediasurvey\.com\/employee\/'),
                new RegExp('http[s]?:\/\/localhost:3000\/employee\/'),
            ];
            regexs.forEach((regex) => {
                if (regex.test(referer)) {
                    validRequest = true;
                    return;
                };
            });
            if (validRequest) {
                return true;
            } else {
                return false;
            };
        };
        return false;
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
        knex("employees").select("username").distinct().then(results => {
            let usernames = [];
            results.forEach((username) => {
                usernames.push(username);
            });
            res.render("signUp", {"params": {"usernames": usernames}});
        });
    });};
    {//Employee Views
    // Landing
    app.get("/employee/index", (req, res) => {
        if (verifyEmployee(req.headers.referer) || req.query.skip) {
            res.render("employee/index");
        } else {
            res.redirect("/login");
        };
    });
    // Tableau
    app.get("/employee/tableau", (req, res) => {
        if (verifyEmployee(req.headers.referer)) {
            res.render("employee/tableau");
        } else {
            res.redirect("/login");
        };
    });
    // Take a Survey
    app.get("/employee/survey", (req, res) => {
        if (verifyEmployee(req.headers.referer)) {
            res.render("employee/survey");
        } else {
            res.redirect("/login");
        };
    });
    // View Raw Data
    app.get("/employee/data", (req, res) => {
        if (verifyEmployee(req.headers.referer)) {
            res.render("employee/data");
        } else {
            res.redirect("/login");
        };
    });
    // Edit Account Info
    app.get("/employee/account", (req, res) => {
        if (verifyEmployee(req.headers.referer)) {
            res.render("employee/account");
        } else {
            res.redirect("/login");
        };
    });};
    {//Admin Views
    // Landing
    app.get("/admin/index", (req, res) => {
        if (verifyAdmin(req.headers.referer) || req.query.skip) {
            res.render("admin/index");
        } else {
            res.redirect("/login");
        };
    });
    // Tableau
    app.get("/admin/tableau", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            res.render("admin/tableau");
        } else {
            res.redirect("/login");
        };
    });
    // Take a Survey
    app.get("/admin/survey", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            res.render("admin/survey");
        } else {
            res.redirect("/login");
        };
    });
    // View/Edit Raw Data
    app.get("/admin/data", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            knex("surveyee_info").then(surveys => {
                let columns = [];
                let rows = [];
                if (!surveys.length == 0) {
                    for (let [key, value] of Object.entries(surveys[0])) {
                        columns.push(key);
                    };
                    surveys.forEach((survey) => {
                        let survey_vals = [];
                        for (let [key, value] of Object.entries(survey)) {
                            survey_vals.push(value);
                        };
                        rows.push(survey_vals);
                    });
                };
                res.render("admin/data", {"params": {"columns": columns, "rows": rows}});
            });
        } else {
            res.redirect("/login");
        };
    });
    // View Google Analytics
    app.get("/admin/analytics", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            res.render("admin/analytics");
        } else {
            res.redirect("/login");
        };
    });
    // Elevate employee accounts
    app.get("/admin/empmloyees", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            res.render("admin/employees");
        } else {
            res.redirect("/login");
        };
    });
    // Edit Account Info
    app.get("/admin/account", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            res.render("admin/account");
        } else {
            res.redirect("/login");
        };
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
    };
    {//API Actions
    };
    app.get("/testAdmin", (req, res) => {
        res.redirect("/admin/index?skip=" + true);
    });
    app.get("/testEmployee", (req, res) => {
        res.redirect("/employee/index?skip=" + true);
    });
};