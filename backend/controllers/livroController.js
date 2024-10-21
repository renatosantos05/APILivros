const main = require("../database/conn");
const {Livro: LivroModel, Livro } = require("../models/Livro");
const mongoose = require('mongoose');

const livroController = {

    getAll: async(req, res) => {
        try {
            let results = await LivroModel.find({});
            res.status(200).send(results);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Erro ao obter livros" });
        }
    },

};

module.exports = livroController;
