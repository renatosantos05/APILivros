const request = require('supertest');
const { app, server } = require('../app');
const mongoose = require('mongoose');

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
