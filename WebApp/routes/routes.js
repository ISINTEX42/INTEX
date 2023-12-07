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

const { urlencoded } = require("express");

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
    // Login
    app.get("/login", (req, res) => {
        res.render("login", {"params": {"failed": req.query.failed == 'true' ? true : false, "username": req.query.username || ""}})
    });
    // Signup
    app.get("/signUp", (req, res) => {
        knex("employees").select("username").distinct().then(results => {
            let usernames = [];
            results.forEach((username) => {
                usernames.push(username);
            });
            res.render("signUp", {"params": {"usernames": usernames, "failed": req.query.failed, "result": req.query.result}});
        });
    });
    app.get("/privacy", (req, res) => {
        res.send("Privacy page not implemented for Provo City Survey Pages");
    });
    app.get("/terms", (req, res) => {
        res.send("Terms and conditions page not implemented for Provo City Survey Pages");
    });
    };
    {//Employee Views
    // Landing
    app.get("/employeeindex", (req, res) => {
        if (verifyEmployee(req.headers.referer) || req.query.skip || req.query.login) {
            res.render("employeeindex");
        } else {
            res.redirect("/login");
        };
    });
    // Tableau
    app.get("/employeetableau", (req, res) => {
        if (verifyEmployee(req.headers.referer)) {
            res.render("employeetableau");
        } else {
            res.redirect("/login");
        };
    });
    // Take a Survey
    app.get("/employeesurvey", (req, res) => {
        if (verifyEmployee(req.headers.referer)) {
            res.render("employeesurvey");
        } else {
            res.redirect("/login");
        };
    });
    // View Raw Data
    app.get("/employeedata", (req, res) => {
        if (verifyEmployee(req.headers.referer)) {
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
                res.render("employeedata", {"params": {"columns": columns, "rows": rows}});
            });
        } else {
            res.redirect("/login");
        };
    });
    // Edit Account Info
    app.get("/employeeaccount", (req, res) => {
        if (verifyEmployee(req.headers.referer)) {
            res.render("employeeaccount");
        } else {
            res.redirect("/login");
        };
    });
    app.get("/employeeprivacy", (req, res) => {
        res.send("Privacy page not implemented for Provo City Survey Pages");
    });
    app.get("/employeeterms", (req, res) => {
        res.send("Terms and conditions page not implemented for Provo City Survey Pages");
    });
    };
    {//Admin Views
    // Landing
    app.get("/adminindex", (req, res) => {
        if (verifyAdmin(req.headers.referer) || req.query.skip || req.query.login) {
            res.render("adminindex");
        } else {
            res.redirect("/login");
        };
    });
    // Tableau
    app.get("/admintableau", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            res.render("admintableau");
        } else {
            res.redirect("/login");
        };
    });
    // Take a Survey
    app.get("/adminsurvey", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            res.render("adminsurvey");
        } else {
            res.redirect("/login");
        };
    });
    // View/Edit Raw Data
    app.get("/admindata", (req, res) => {
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
                res.render("admindata", {"params": {"columns": columns, "rows": rows}});
            });
        } else {
            res.redirect("/login");
        };
    });
    // Elevate employee accounts
    app.get("/adminemployees", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            res.render("adminemployees");
        } else {
            res.redirect("/login");
        };
    });
    // Edit Account Info
    app.get("/adminaccount", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            res.render("adminaccount");
        } else {
            res.redirect("/login");
        };
    });
    app.get("/adminprivacy", (req, res) => {
        res.send("Privacy page not implemented for Provo City Survey Pages");
    });
    app.get("/adminterms", (req, res) => {
        res.send("Terms and conditions page not implemented for Provo City Survey Pages");
    });
    };
    {//CRUD Actions
    app.post("/submitSignUp", (req, res) => {
        knex.schema.createTableIfNotExists("employees", table => {
            table.string("username", 60).primary().notNullable();
            table.string("hash").notNullable();
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
                res.redirect("/login");
            });
        });
    });
    app.post("/submitLogin", (req, res) => {
        knex("employees").where(
            {"username": req.body.workEmail}
        ).then(employee => {
            if (employee.length == 0) {
                res.redirect("/login?failed=" + true);
            } else {
                bcrypt.compare(req.body.password, employee[0].hash, (err, same) => {
                    if (same) {
                        if (employee[0].is_admin) {
                            res.redirect("/adminindex?login=" + true);
                        } else {
                            res.redirect("/employeeindex?login=" + true);
                        }
                    } else {
                        res.redirect("/login?failed=true&username=" + req.body.workEmail);
                    }
                });
            };
        });
    });
    };
    {//API Actions
    };
    app.get("/testAdmin", (req, res) => {
        res.redirect("/adminindex?login=" + true);
    });
    app.get("/testEmployee", (req, res) => {
        res.redirect("/employeeindex?login=" + true);
    });
    app.get("/test", (req, res) => {
        res.render("adminaccountdraft", {params: {first_name: "Kimberly", last_name : "Hunter", city_id: 54321, username: "workPlease@provocity.com"}});
    })
};