const livroController = require('../../controllers/livroController');
const { Livro } = require('../../models/Livro');
const mongoose = require('mongoose')

jest.mock('../../models/Livro');

describe('Testes do método getAll', () => {

    it('deve retornar uma lista de livros com status 200', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const livrosMock = [{ titulo: 'Livro A' }, { titulo: 'Livro B' }];
        Livro.find.mockResolvedValue(livrosMock);

        await livroController.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(livrosMock);
    });

    it('deve retornar erro 500 se houver uma falha no banco', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Livro.find.mockRejectedValue(new Error('Erro ao buscar dados'));

        await livroController.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Erro ao obter livros' });
    });

});

describe('Teste do método create de livroController', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('deve cadastrar um novo livro com status 201', async () => {
        const req = {
            body: {
                titulo: 'Novo Livro',
                isbn: '123-456-789',
                autor: 'Autor Teste'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const livroMock = {
            _id: '1',
            titulo: req.body.titulo,
            isbn: req.body.isbn,
            autor: req.body.autor
        };

        Livro.create.mockResolvedValue(livroMock);

        await livroController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ response: livroMock, msg: "Livro cadastrado!" });
    });

    it('deve retornar erro 400 se ocorrer um problema ao cadastrar', async () => {
        const req = {
            body: {
                titulo: 'Livro com Erro',
                isbn: '987-654-321',
                autor: 'Autor Erro'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        Livro.create.mockRejectedValue(new Error('Erro ao salvar'));

        await livroController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: "Erro ao cadastrar livro" });
    });
});

describe('Teste do método delete de livroController', () => {

    it('deve retornar 204 ao deletar um livro existente', async () => {
        const req = { params: { id: '634d1f77f5f9b4c7d59c4b1a' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        Livro.deleteOne.mockResolvedValue({ deletedCount: 1 });

        await livroController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar 404 se o ID for inválido', async () => {
        const req = { params: { id: 'id-invalido' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

        await livroController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: "Livro não encontrado" });
    });
    
    it('deve retornar erro 500 ao ocorrer um problema inesperado', async () => {
        const req = { params: { id: '634d1f77f5f9b4c7d59c4b1a' } }; 
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
    
        Livro.deleteOne.mockRejectedValue(new Error('Erro ao deletar no banco'));

        await livroController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: "Erro ao deletar livro" });
    });
});
