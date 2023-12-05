module.exports = (app) => {
    // Index Routes
    // Get request ONLY used when entering from outside website
    app.get("/", (req, res) => {
        res.render("index", {"params": {"isAuthenticated": false}});
    });
    // Post request checks if isAuthenticated exists returning false if not
    app.post("/", (req, res) => {
        res.render("index", {"params": {
            "isAuthenticated": req.body.hasAttribute("isAuthenticated") ? req.body.isAuthenticated : false}
        });
    });


    // Tableau Routes
    // Get request ONLY used when entering from outside website
    app.get("/tableau", (req, res) => {
        res.render("tableau", {"params": {"isAuthenticated": false}});
    });
    // Post request checks if isAuthenticated exists returning false if not
    app.post("/tableau", (req, res) => {
        res.render("tableau", {"params": {
            "isAuthenticated": req.body.hasAttribute("isAuthenticated") ? req.body.isAuthenticated : false}
        });
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