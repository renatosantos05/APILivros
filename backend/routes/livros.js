const router = require("express").Router()
const livroController = require("../controllers/livroController");

router.route("/livros/all").get((req, res)=> livroController.getAll(req,res));
router.route("/livros").post((req, res)=>livroController.create(req,res));
router.route("/livros/delete/:id").delete((req, res)=> livroController.delete(req,res));

module.exports = router;