const router = require("express").Router()
const livroController = require("../controllers/livroController");

router.route("/livros/all").get((req, res)=> livroController.getAll(req,res));

module.exports = router;