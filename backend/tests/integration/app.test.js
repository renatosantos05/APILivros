const request = require('supertest');
const { app, server } = require('../../app');
const mongoose = require('mongoose');
const { Livro } = require('../../models/Livro');


afterAll(async () => {
    await server.close();  
    await mongoose.connection.close();  
});

describe('PostLivros', () => {
    it('Deve adicionar um livro e retornar status 201', async () => {
        jest.setTimeout(10000);
        const livro = {
            titulo: 'Sobrevivendo no inferno',
            isbn: '1234',
            autor: 'Racionais'
        };

        const response = await request(app)
            .post('/api/livros')
            .send(livro);

        
        expect(response.status).toBe(201);
        

        expect(response.body).toHaveProperty('msg', 'Livro cadastrado!');
        expect(response.body.response).toMatchObject({
            titulo: 'Sobrevivendo no inferno',
            isbn: '1234',
            autor: 'Racionais'
        });
    });

    it('Deve retornar status 400 se faltar campos obrigatorios', async () => {
        const livro = {
            titulo: 'Sobrevivendo no inferno',
            isbn: '1234',
            
        };

        const response = await request(app)
            .post('/api/livros')
            .send(livro);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg', 'Erro ao cadastrar livro');
    });
});

describe('GetLivros', () => {
    it('Deve retornar todos os livros com status 200', async () => {
        
        const livro = new Livro({
            titulo: 'Sobrevivendo no inferno',
            isbn: '1234',
            autor: 'Racionais'
        });
        await livro.save();

        const response = await request(app)
            .get('/api/livros/all')
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    titulo: 'Sobrevivendo no inferno',
                    isbn: '1234',
                    autor: 'Racionais'
                })
            ])
        );
    });

    it('Deve retornar status 500 se houver erro ao obter livros', async () => {

        const mockFind = jest.spyOn(Livro, 'find').mockRejectedValueOnce(new Error('Erro ao obter livros'));

        const response = await request(app)
            .get('/api/livros/all')
            .send();

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Erro ao obter livros');

        mockFind.mockRestore();
    });
});

describe('DeleteLivros', () => {
    let livroId;

    beforeAll(async () => {
        const livro = new Livro({
            titulo: 'Sobrevivendo no inferno',
            isbn: '1234',
            autor: 'Racionais'
        });
        const savedLivro = await livro.save();
        livroId = savedLivro._id;
    });

    it('Deve excluir um livro com sucesso e retornar status 204', async () => {
        const response = await request(app)
            .delete(`/api/livros/delete/${livroId}`)
            .send();

        expect(response.status).toBe(204);
    });

    it('Deve retornar status 404 se o ID do livro não for válido', async () => {
        const invalidId = 'invalidid12345'; 

        const response = await request(app)
            .delete(`/api/livros/delete/${invalidId}`)
            .send();

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('msg', 'Livro não encontrado');
    });

    it('Deve retornar status 500 se houver erro ao deletar livro', async () => {
        
        const mockDelete = jest.spyOn(Livro, 'deleteOne').mockRejectedValueOnce(new Error('Erro ao deletar livro'));

        const response = await request(app)
            .delete(`/api/livros/delete/${livroId}`)
            .send();

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Erro ao deletar livro');

        mockDelete.mockRestore();
    });
});


