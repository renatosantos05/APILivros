
const express = require("express");

const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());


const conn = require("./database/conn")
conn();


const routes = require("./routes/router");
app.use("/api",routes);

const server = app.listen(3000, () => {
    console.log('Server running on port 3000');
});

module.exports = {app,server}