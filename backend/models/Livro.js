const mongoose = require("mongoose");
const{Schema} = mongoose;

const livroSchema = new Schema({
    titulo:{
        type: String,
        require: true,
    },
    isbn: {
        type: String,
        require: true,
    },
    autor:{
        type: String,
        require: true
    }
}, 
{timestamps: true}
);

const Livro = mongoose.model("Livro", livroSchema);
module.exports = {
    Livro,
    livroSchema,
};