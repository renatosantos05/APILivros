const mongoose = require("mongoose");
const{Schema} = mongoose;

const livroSchema = new Schema({
    titulo:{
        type: String,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
    },
    autor:{
        type: String,
        required: true
    }
}, 
{timestamps: true}
);

const Livro = mongoose.model("Livro", livroSchema);
module.exports = {
    Livro,
    livroSchema,
};