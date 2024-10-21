const mongoose = require("mongoose");

async function main(){
    try {
         
        mongoose.set("strictQuery",true);
        
        await mongoose.connect('mongodb://127.0.0.1:27017/banco');
        
        console.log("conectado ao mongodb");
    } catch (error) {
       
        console.log(`Error: ${error}`);
    }
}

module.exports = main;