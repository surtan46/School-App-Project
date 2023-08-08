const express = require("express");
const mysql = require("mysql");
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hoss",
});

const app = express();
app.use(express.static("public"));
//middleware
app.use(express.urlencoded({ extended: false })); // supply req.body object with form data
// server static files in express
const port = process.env.port || 3003;

function midfunc(req, res, next) {
  console.log(req.path);
  console.log("I am a middleware function!!!");
  // logic--e.g authorization
  next();
}
app.use(midfunc);

//res.send("Home route in the server responding!!!");
app.get("/", (req, res) => {
  conn.query("SELECT * FROM students", (sqlerr1, students) => {
    if (!sqlerr1) {
      //continue
      conn.query("SELECT * FROM teachers", (sqlerr2, teachers) => {
        if (sqlerr2) {
          res.send("Database Error Occured");
        } else {
          //console.log(students);
          //console.log(teachers);
          res.render("home.ejs", { students: students, teachers: teachers });
        }
      });
    } else {
      res.send("Database Error Occured");
    }
  });
});

app.get("/news/sports/epl-transfers", (req, res) => {
  // sports route
  console.log("sports route requested");
  res.status(200);
  //res.send("Sports route in the server responding!!!");
  res.render("blog.ejs");
});

app.get("/newStaff", midfunc, (req, res) => {
  res.render("newTeacher.ejs");
});

app.get("/newstudents", midfunc, (req, res) => {
  res.render("newStudent.ejs");
});

app.post("/addstudent", (req, res) => {
  // save the data to db
  console.log(req.body);
  //redirect user to home/ root route
  conn.query(
    "INSERT INTO students (reg_no,fullname,class) VALUES(?,?,?)",
    [Number(req.body.reg, req.body.name, req.body.class)],
    (sqlerror) => {
      if (sqlerror) {
        console.log(sqlerror);
        res.send("A Db error occured while saving new student");
      } else {
        res.redirect("/");
      }
    }
  );
});

// new student
//app.post("/", () => {});

// environment variables ---show how to use .env in a node project
// truthy and falsy values
// http status codes
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("App is running and listening on port 3003");
  }
});
