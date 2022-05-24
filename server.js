import express from "express";
import morgan from "morgan";
import fs from "fs";

const app = express();
const PORT = 8012;
let apiIsOn = true;
let apiStatus = 200;

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static("dist"));
app.use("/", express.static("static"));

app.listen(
    PORT,
    console.log(
        `\n\n\n===============================\nServer Listening on: http://localhost:${PORT}`
    )
);
