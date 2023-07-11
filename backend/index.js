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
  const Query = "Select * FROM tbl_student ORDER BY rollno";

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
});
