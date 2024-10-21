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

    create: async(req, res) => {
        try {
            const livro = {
                titulo: req.body.titulo,
                isbn: req.body.isbn,
                autor: req.body.autor
            };
            const response = await LivroModel.create(livro);
            res.status(201).json({response, msg:"Livro cadastrado!"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Erro ao cadastrar livro" });
        }
    },

};

module.exports = livroController;
