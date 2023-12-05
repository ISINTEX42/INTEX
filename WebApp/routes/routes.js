module.exports = (app) => {
    app.get("/", (req, res) => {
        res.render("index");
    });

// link to our tableau page
    app.get("/tableau", (req, res) => {
        res.render("tableau");
    });

// link to survey page
    app.get("/survey", (req, res) => {
        res.render("survey");
});

// link to data admin page
    app.get("/adminData", (req, res) => {
        res.render("adminData");
});

// link to sign up page - firstName, LastName, UserName, Password, Hidden API
app.get("/signUp", (req, res) => {
    res.render("signUp");
});


};