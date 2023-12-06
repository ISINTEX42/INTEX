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
        res.render("signUp");
    });};
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
    };
    {//API Actions
    };
    app.get("/Landing", (req, res) => {
        res.render("Landing");
    });
};