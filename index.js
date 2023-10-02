const { faker } = require("@faker-js/faker");

const mysql = require("mysql2");
const express = require("express");
const methodOverride = require("method-override");
const app = express();
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
// sql connection 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'practice1',
    password: 'Abhay@1234'
});
// random user create func
let createRandomUser = () => {
    return {
        userId: faker.string.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password: faker.internet.password(),
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past(),
    };
};
// HOME ROUTE 
app.get("/", (req, res) => {

    try {
        let p = `SELECT COUNT(*) as count FROM user`;
        let result;
        connection.query(p, (error, response) => {
            if (error) throw error;
            let data = response[0];
            res.render("home.ejs", { data });
        })
    }
    catch (error) {
        console.log(error);
    }
})
// SHOW ROUTE
app.get("/user", (req, res) => {
    try {
        let p = `SELECT id,email,username FROM user`;
        connection.query(p, (error, response) => {
            if (error) throw error;
            let data = response;
            //console.log(data);
            res.render("users.ejs", { data });
        })
    }
    catch (error) {
        console.log(error);
    }
})
// edit page Route
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    try {
        let q = `SELECT id,username,email,password FROM user WHERE id = ?`;
        connection.query(q, [id], (error, response) => {
            if (error) throw error;
            let data = response[0];
            console.log(data);
            res.render("editUser.ejs", { data });
        })
    }
    catch (error) {
        console.log(error);
    }
})
//update route
app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let info = req.body;
    console.log(info, id);
    try {
        let q = `SELECT * FROM user WHERE id = ?`;
        connection.query(q, [id], (error, response) => {
            if (error) throw error;
            console.log(response);
            if (response[0].password == info.password) {
                try {
                    let q = "UPDATE  user set username = ? , email = ? WHERE id = ?"
                    connection.query(q, [info.username, info.email, id], (updateError, UpdateRes) => {
                        if (updateError) throw updateError;
                        console.log("updated");
                        // console.log(UpdateRes);
                        // if updated redirect to home page
                        res.redirect("/");
                    })
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                res.send("wrong password");
            }

        })
    }
    catch (error) {
        console.log(error);
        res.send("invalid password or server error");
    }
})

// post route new user route
app.get("/users/new", (req, res) => {
    res.render("newUser.ejs");
})

// add new user
app.post("/users/new", (req, res) => {
    let id = faker.string.uuid();
    let info = req.body;
    info.id = id;
    let data = info;
    console.log(info, id);
    // sql command to enter data
    try {
        let p = `INSERT INTO user (email,id,password,username) VALUES (?,?,?,?)`;
        connection.query(p, [info.email, id, info.password, info.username], (error, result) => {
            if (error) {
                res.send("email or username already exists or database falure");
                throw error;
            }
            console.log("sucess");
            console.log(result);
            res.render("editUser.ejs", data);
        })

    }
    catch (error) {
        console.log(error);
        res.send("email or username already exists or database falure");
    }
})




















app.listen("8080", () => {
    console.log("server listening to 8080");
})
