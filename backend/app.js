
const express = require("express");

const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());


const conn = require("./database/conn")
conn();


const routes = require("./routes/router");
app.use("/api",routes);


const port = 3000;
app.listen(port, function(){
    console.log("Servidor ativo.");
})