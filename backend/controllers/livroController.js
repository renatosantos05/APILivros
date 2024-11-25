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
            res.status(400).json({ msg: "Erro ao cadastrar livro" });
        }
    },

    delete: async(req, res) => {
        try {
            const id = req.params.id;
            if (!mongoose.isValidObjectId(id)) {
                return res.status(404).json({ msg: "ID inválido" });
            }
            let results = await LivroModel.deleteOne({_id: id});
            res.status(204).send(results);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Erro ao deletar livro" });
        }
    },

};

module.exports = livroController;
