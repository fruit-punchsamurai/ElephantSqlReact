const express = require("express");
const { Client } = require("pg");
const fs = require("fs");
const cors = require("cors");
const configData = fs.readFileSync("config.json", "utf-8");
const config = JSON.parse(configData);

const app = express();
const port = 5000;

const client = new Client({
  host: config.host,
  port: config.port,
  database: config.database,
  user: config.user,
  password: config.password,
});

app.use(cors());
app.use(express.json());

client.connect((error) => {
  if (error) {
    console.log("Error connecting to database : ", error);
  } else {
    console.log("Connected to database");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/submit", async (req, res) => {
  const Query =
    "INSERT INTO tbl_student(rollNo, firstName, lastName, address, department, age) VALUES ($1,$2,$3,$4,$5,$6)";
  const values = [
    req.body.rollno,
    req.body.fname,
    req.body.lname,
    req.body.address,
    req.body.department,
    req.body.age,
  ];
  console.log(req.body);

  await client.query(Query, values, (error) => {
    if (error) {
      console.log("Error saving data :", error);
      res.status(500).send("Error saving data");
    } else {
      console.log("Data saved successfully");
      res.status(200).send("Data saved successfully");
    }
  });
});

app.get("/tabledata", async (req, res) => {
  const orderBy = req.query.orderBy;
  const Query = "Select * FROM tbl_student ORDER BY " + orderBy;
  await client.query(Query, async (error, result) => {
    if (error) {
      console.log("Error retrieving data", error);
      res.status(500).send("Error retrieving data");
    } else {
      console.log(result.rows);
      res.status(200).json(result.rows);
    }
  });
});

app.post("/delete", async (req, res) => {
  const rollNos = req.body;
  let text = "";
  rollNos.map((rollno) => (text += rollno.toString() + ","));
  text = text.slice(0, -1);
  const Query = "DELETE FROM tbl_student WHERE rollno IN" + "(" + text + ")";
  await client.query(Query, async (error, result) => {
    if (error) {
      console.log("Error deleting data : ", error);
      res.status(500).send("Error deleting data");
    } else {
      console.log("Data deleted successfully");
      res.status(200).send("Data deleted successfully");
    }
  });
});

app.post("/update", async (req, res) => {
  console.log("--------------------------------", req.body);
  const Query =
    "UPDATE tbl_student SET rollno = $1,firstname = $2,lastname = $3,address = $4,department = $5,age = $6 WHERE rollno = $7";
  const values = [
    req.body.rollno,
    req.body.fname,
    req.body.lname,
    req.body.address,
    req.body.department,
    req.body.age,
    req.body.oldrollno,
  ];

  await client.query(Query, values, (error) => {
    if (error) {
      console.log("Error updating data :", error);
      res.status(500).send("Error updating data");
    } else {
      console.log("Data Updated successfully");
      res.status(200).send("Data Updated successfully");
    }
  });
});

const server = app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  client.end(() => {
    console.log("Database connection closed");
  });
  server.close(() => {
    console.log("Server Stopped");
  });
  process.exit(0);
});
