import express from "express";
import patientsRouter from "./src/Router/patients";
import diagnosesRouter from  "./src/Router/diagnoses";
import entriesRouter from "./src/Router/entries"


const cors = require("cors") // eslint-disable-line
const app  = express();
app.use(express.json());
app.use(cors()) // eslint-disable-line

app.use("/api/ping", (_req, res)=>{
    console.log("Someone pinged here");
    res.send("pong");
});

app.use(("/api/patients"), patientsRouter);
app.use("/api/diagnoses", diagnosesRouter);
app.use("/api/patients", entriesRouter);

const PORT = 3001;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});