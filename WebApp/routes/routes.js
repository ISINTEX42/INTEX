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
                new RegExp('http[s]?:\/\/mindfulmediasurvey\.com\/admin'),
                new RegExp('http[s]?:\/\/localhost:3000\/admin')
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
                new RegExp('http[s]?:\/\/mindfulmediasurvey\.com\/employee'),
                new RegExp('http[s]?:\/\/localhost:3000\/employee'),
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
    };
    {//Public Views
    // Landing
    app.get("/", (req, res) => {
        res.render("index");
    });
    app.get("/index", (req, res) => {
        res.redirect("/");
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
        }).catch(err => {
            if (err.routine == "parserOpenTable") {
                knex.schema.createTableIfNotExists("employees", table => {
                    table.string("username", 60).primary().notNullable();
                    table.string("hash").notNullable();
                    table.string("first_name", 30).notNullable();
                    table.string("last_name", 30).notNullable();
                    table.string("city_id", 60).notNullable();
                    table.boolean("is_admin").notNullable();
                }).then(employees => {
                    createEmployee(
                        "admin@provocity.com",
                        "CHANGEME123!",
                        "DEFAULT",
                        "ADMIN",
                        "CHANGEME123!",
                        true
                    );
                    createEmployee(
                        "employee@provocity.com",
                        "CHANGEME456!",
                        "DEFAULT",
                        "EMPLOYEE",
                        "CHANGEME456!",
                        true
                    );
                });
                res.render("signUp", {"params": 
                    {"usernames": ["employee@provocity.com", "admin@provocity.com"], 
                    "failed": req.query.failed, "result": req.query.result
                }});
            };
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
            res.render("employeeindex", {"params": {"username": req.query.username}});
        } else {
            res.redirect("/login");
        };
    });
    // Tableau
    app.get("/employeetableau", (req, res) => {
        if (verifyEmployee(req.headers.referer)) {
            res.render("employeetableau", {"params": {"username": req.query.username}});
        } else {
            res.redirect("/login");
        };
    });
    // Take a Survey
    app.get("/employeesurvey", (req, res) => {
        if (verifyEmployee(req.headers.referer)) {
            res.render("employeesurvey", {"params": {"username": req.query.username}});
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
        };encodeURIComponent
    });
    // Edit Account Info
    app.get("/employeeaccount", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            knex("employees").where({
                "username": req.query.username
            }).then(employee => {
                res.render("adminaccount", {"params": 
                {"username": req.query.username, 
                "city_id": employee.city_id,
                "first_name": employee.first_name,
                "last_name": employee.last_name
            }});
            });
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
            res.render("adminindex", {"params": {"username": req.query.username}});
        } else {
            res.redirect("/login");
        };
    });
    // Tableau
    app.get("/admintableau", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            res.render("admintableau", {"params": {"username": req.query.username}});
        } else {
            res.redirect("/login");
        };
    });
    // Take a Survey
    app.get("/adminsurvey", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            res.render("adminsurvey", {"params": {"username": req.query.username}});
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
                res.render("admindata", {"params": {"columns": columns, "rows": rows, "username": req.query.username}});
            });
        } else {
            res.redirect("/login");
        };
    });
    // Elevate employee accounts
    app.get("/adminemployees", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            res.send("Employee Management not yet Available");
        } else {
            res.redirect("/login");
        };
    });
    // Edit Account Info
    app.get("/adminaccount", (req, res) => {
        if (verifyAdmin(req.headers.referer)) {
            knex("employees").where({
                "username": req.query.username
            }).then(employee => {
                res.render("adminaccount", {"params": 
                {"username": req.query.username, 
                "city_id": employee.city_id,
                "first_name": employee.first_name,
                "last_name": employee.last_name
            }});
            });
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
    {//DB Post Actions
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
                    createEmployee(
                        "admin@provocity.com",
                        "CHANGEME123!",
                        "DEFAULT",
                        "ADMIN",
                        "CHANGEME123!",
                        true
                    );
                    createEmployee(
                        "employee@provocity.com",
                        "CHANGEME456!",
                        "DEFAULT",
                        "EMPLOYEE",
                        "CHANGEME456!",
                        true
                    );
                };
                createEmployee(
                    req.body.workEmail,
                    req.body.password,
                    req.body.employeeFirstName,
                    req.body.employeeLastName,
                    req.body.employeeId,
                    false
                );
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
                            res.redirect("/adminindex?login=true&username=" + req.body.workEmail);
                        } else {
                            res.redirect("/employeeindex?login=true&username=" + req.body.workEmail);
                        }
                    } else {
                        res.redirect("/login?failed=true&username=" + req.body.workEmail);
                    }
                });
            };
        }).catch(err => {
            if (err.routine == "parserOpenTable") {
                knex.schema.createTableIfNotExists("employees", table => {
                    table.string("username", 60).primary().notNullable();
                    table.string("hash").notNullable();
                    table.string("first_name", 30).notNullable();
                    table.string("last_name", 30).notNullable();
                    table.string("city_id", 60).notNullable();
                    table.boolean("is_admin").notNullable();
                }).then(employees => {
                    createEmployee(
                        "admin@provocity.com",
                        "CHANGEME123!",
                        "DEFAULT",
                        "ADMIN",
                        "CHANGEME123!",
                        true
                    );
                    createEmployee(
                        "employee@provocity.com",
                        "CHANGEME456!",
                        "DEFAULT",
                        "EMPLOYEE",
                        "CHANGEME456!",
                        true
                    );
                });
                res.redirect("/login?failed=" + true);
            };
        });
    });
    app.post("/submitSurvey", (req, res) => {
        knex("surveyees").max("surveyee_id", {as: "surveyee_id"}).first().then(id => {
            let insertID = parseInt(id.surveyee_id) + 1;
            let age = Math.round(req.body.age);
            let now = new Date();
            knex.insert(
                {
                    surveyee_id: insertID,
                    survey_timestamp: now.toISOString(),
                    age: age,
                    gender: req.body.gender
                },
                ['surveyee_id']
            ).into("surveyees").then(id => {
                let time;
                switch (req.body.time) {
                    case "Less than an Hour":
                        time = "<1";
                        break;
                    case "Between 1 and 2 hours":
                        time = "1-2";
                        break;
                    case "Between 2 and 3 hours":
                        time = "2-3";
                        break;
                    case "Between 3 and 4 hours":
                        time = "3-4";
                        break;
                    case "Between 4 and 5 hours":
                        time = "4-5";
                        break;
                    default:
                        time = "5<";
                };
                knex.insert(
                    {
                        surveyee_id: id,
                        relationship_status: req.body.relationshipStat,
                        occupation_status: req.body.occupation,
                        is_media_user: req.body.socialMedia === "true",
                        media_usage: time,
                        purpose_frequency: req.body.purpose,
                        distration_frequency: req.body.distractBusy,
                        restless_amount: req.body.restless,
                        distraction_amount: req.body.distracted,
                        worried_amount: req.body.worries,
                        concentration_amount: req.body.concentrate,
                        comparison_frequency: req.body.compareSuccess,
                        comparison_amount: req.body.compareFeel,
                        validation_frequency: req.body.validation,
                        depression_frequency: req.body.depressed,
                        fluctuation_frequency: req.body.interest,
                        sleep_frequency: req.body.sleep,
                        survey_city: req.body.surveyCity
                    }
                ).into("surveyee_info");
                req.body.affiliation.forEach((affiliation, index) => {
                    knex.insert(
                        {
                            surveyee_id: id,
                            affiliation_num: index,
                            affiliation: affiliation
                        }
                    ).into("surveyee_affiliations");
                });
                req.body.platforms.forEach((platform, index) => {
                    knex.insert(
                        {
                            surveyee_id: id,
                            platform_num: index,
                            platform: platform
                        }
                    ).into("surveyee_platforms");
                });
                req.body.platforms.forEach((platform, plat_index) => {
                    req.body.affiliation.forEach((affiliation, aff_index) => {
                        knex.insert(
                            {
                                surveyee_id: id,
                                affiliation_num: aff_index,
                                platform_num: plat_index
                            }
                        ).into("survey_responses");
                    });
                });
                res.redirect("/index");
            });
        });
    });
    app.post("/adminSubmitSurvey", (req, res) => {
        knex("surveyees").max("surveyee_id", {as: "surveyee_id"}).first().then(id => {
            let insertID = parseInt(id.surveyee_id) + 1;
            let age = Math.round(req.body.age);
            let now = new Date();
            knex.insert(
                {
                    surveyee_id: insertID,
                    survey_timestamp: now.toISOString(),
                    age: age,
                    gender: req.body.gender
                },
                ['surveyee_id']
            ).into("surveyees").then(id => {
                let time;
                switch (req.body.time) {
                    case "Less than an Hour":
                        time = "<1";
                        break;
                    case "Between 1 and 2 hours":
                        time = "1-2";
                        break;
                    case "Between 2 and 3 hours":
                        time = "2-3";
                        break;
                    case "Between 3 and 4 hours":
                        time = "3-4";
                        break;
                    case "Between 4 and 5 hours":
                        time = "4-5";
                        break;
                    default:
                        time = "5<";
                };
                knex.insert(
                    {
                        surveyee_id: id,
                        relationship_status: req.body.relationshipStat,
                        occupation_status: req.body.occupation,
                        is_media_user: req.body.socialMedia === "true",
                        media_usage: time,
                        purpose_frequency: req.body.purpose,
                        distration_frequency: req.body.distractBusy,
                        restless_amount: req.body.restless,
                        distraction_amount: req.body.distracted,
                        worried_amount: req.body.worries,
                        concentration_amount: req.body.concentrate,
                        comparison_frequency: req.body.compareSuccess,
                        comparison_amount: req.body.compareFeel,
                        validation_frequency: req.body.validation,
                        depression_frequency: req.body.depressed,
                        fluctuation_frequency: req.body.interest,
                        sleep_frequency: req.body.sleep,
                        survey_city: req.body.surveyCity
                    }
                ).into("surveyee_info");
                req.body.affiliation.forEach((affiliation, index) => {
                    knex.insert(
                        {
                            surveyee_id: id,
                            affiliation_num: index,
                            affiliation: affiliation
                        }
                    ).into("surveyee_affiliations");
                });
                req.body.platforms.forEach((platform, index) => {
                    knex.insert(
                        {
                            surveyee_id: id,
                            platform_num: index,
                            platform: platform
                        }
                    ).into("surveyee_platforms");
                });
                req.body.platforms.forEach((platform, plat_index) => {
                    req.body.affiliation.forEach((affiliation, aff_index) => {
                        knex.insert(
                            {
                                surveyee_id: id,
                                affiliation_num: aff_index,
                                platform_num: plat_index
                            }
                        ).into("survey_responses");
                    });
                });
                res.redirect("/adminindex");
            });
        });
    });
    app.post("/employeeSubmitSurvey", (req, res) => {
        knex("surveyees").max("surveyee_id", {as: "surveyee_id"}).first().then(id => {
            let insertID = parseInt(id.surveyee_id) + 1;
            let age = Math.round(req.body.age);
            let now = new Date();
            knex.insert(
                {
                    surveyee_id: insertID,
                    survey_timestamp: now.toISOString(),
                    age: age,
                    gender: req.body.gender
                },
                ['surveyee_id']
            ).into("surveyees").then(id => {
                let time;
                switch (req.body.time) {
                    case "Less than an Hour":
                        time = "<1";
                        break;
                    case "Between 1 and 2 hours":
                        time = "1-2";
                        break;
                    case "Between 2 and 3 hours":
                        time = "2-3";
                        break;
                    case "Between 3 and 4 hours":
                        time = "3-4";
                        break;
                    case "Between 4 and 5 hours":
                        time = "4-5";
                        break;
                    default:
                        time = "5<";
                };
                knex.insert(
                    {
                        surveyee_id: id,
                        relationship_status: req.body.relationshipStat,
                        occupation_status: req.body.occupation,
                        is_media_user: req.body.socialMedia === "true",
                        media_usage: time,
                        purpose_frequency: req.body.purpose,
                        distration_frequency: req.body.distractBusy,
                        restless_amount: req.body.restless,
                        distraction_amount: req.body.distracted,
                        worried_amount: req.body.worries,
                        concentration_amount: req.body.concentrate,
                        comparison_frequency: req.body.compareSuccess,
                        comparison_amount: req.body.compareFeel,
                        validation_frequency: req.body.validation,
                        depression_frequency: req.body.depressed,
                        fluctuation_frequency: req.body.interest,
                        sleep_frequency: req.body.sleep,
                        survey_city: req.body.surveyCity
                    }
                ).into("surveyee_info");
                req.body.affiliation.forEach((affiliation, index) => {
                    knex.insert(
                        {
                            surveyee_id: id,
                            affiliation_num: index,
                            affiliation: affiliation
                        }
                    ).into("surveyee_affiliations");
                });
                req.body.platforms.forEach((platform, index) => {
                    knex.insert(
                        {
                            surveyee_id: id,
                            platform_num: index,
                            platform: platform
                        }
                    ).into("surveyee_platforms");
                });
                req.body.platforms.forEach((platform, plat_index) => {
                    req.body.affiliation.forEach((affiliation, aff_index) => {
                        knex.insert(
                            {
                                surveyee_id: id,
                                affiliation_num: aff_index,
                                platform_num: plat_index
                            }
                        ).into("survey_responses");
                    });
                });
                res.redirect("/employeeindex");
            });
        });
    });
    app.post("/adminEditAccount", (req, res) => {
        knex("employees").where({
            "username": req.body.username
        }).update({
            "first_name": req.body.first_name,
            "last_name": req.body.last_name
        }).then(employee => {
            res.render("adminIndex", {"params": {"username": req.body.username}})
        });
    });
    app.post("/employeeEditAccount", (req, res) => {
        knex("employees").where({
            "username": req.body.username
        }).update({
            "first_name": req.body.first_name,
            "last_name": req.body.last_name
        }).then(employee => {
            res.render("employeeIndex", {"params": {"username": req.body.username}})
        });
    });

    app.get("/help", (req, res) => {
        res.render("help")
    });


    app.get("/help", (req, res) => {
        res.render("help")
    });
    };
    console.log(new Date().toISOString())
};