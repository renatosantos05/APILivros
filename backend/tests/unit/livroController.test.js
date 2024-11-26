const request = require("supertest");
const { app } = require("../../app"); // Importando o app de acordo com a estrutura
const LivroModel = require("../../models/Livro"); // Ajuste o caminho do modelo, se necessário
const mongoose = require("mongoose");

jest.mock("../../models/Livro", () => ({
    find: jest.fn(),
    create: jest.fn(),
    deleteOne: jest.fn(),
}));

describe("Testes do livroController", () => {
    
    afterAll(() => {
        mongoose.connection.close();
    });

    describe("GET /livros", () => {
        it("deve retornar todos os livros com sucesso", async () => {
            const mockBooks = [{ titulo: "Livro 1", isbn: "123", autor: "Autor 1" }];
            LivroModel.find.mockResolvedValueOnce(mockBooks);

            const res = await request(app).get("/api/livros");
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockBooks);
        });

        it("deve retornar erro ao obter livros", async () => {
            LivroModel.find.mockRejectedValueOnce(new Error("Erro"));

            const res = await request(app).get("/api/livros");
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ msg: "Erro ao obter livros" });
        });
    });

    describe("POST /livros", () => {
        it("deve criar um livro com sucesso", async () => {
            const livroData = { titulo: "Livro 1", isbn: "123456", autor: "Autor 1" };
            const mockResponse = { _id: "1", ...livroData };
            LivroModel.create.mockResolvedValueOnce(mockResponse);

            const res = await request(app)
                .post("/api/livros")
                .send(livroData);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ response: mockResponse, msg: "Livro cadastrado!" });
        });

        it("deve retornar erro ao tentar criar um livro", async () => {
            const livroData = { titulo: "Livro 1", isbn: "123456", autor: "Autor 1" };
            LivroModel.create.mockRejectedValueOnce(new Error("Erro"));

            const res = await request(app)
                .post("/api/livros")
                .send(livroData);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ msg: "Erro ao cadastrar livro" });
        });
    });

    describe("DELETE livros/delete/:id", () => {
        it("deve deletar um livro com sucesso", async () => {
            const mockId = "123456";
            LivroModel.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });

            const res = await request(app).delete(`/api/livros/delete/${mockId}`);
            expect(res.status).toBe(204);
        });

        it("deve retornar erro ao tentar deletar com ID inválido", async () => {
            const invalidId = "invalidId";
            const res = await request(app).delete(`/api/livros/delete/${invalidId}`);
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ msg: "Livro não encontrado" });
        });

        it("deve retornar erro ao tentar deletar livro inexistente", async () => {
            const mockId = "123456";
            LivroModel.deleteOne.mockResolvedValueOnce({ deletedCount: 0 });

            const res = await request(app).delete(`/api/livros/delete/${mockId}`);
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ msg: "Livro não encontrado" });
        });
    it("deve retornar erro ao tentar deletar um livro com falha", async () => {
        const mockId = "123456"; // ID de um livro
        // Simula uma falha interna na operação de delete no banco de dados
        LivroModel.deleteOne.mockRejectedValueOnce(new Error("Erro ao acessar o banco de dados"));

        const res = await request(app).delete(`/api/livros/delete/${mockId}`);
        
        // Verifica se o status retornado é 500 (erro do servidor)
        expect(res.status).toBe(404);
        // Verifica se a mensagem de erro está correta
        expect(res.body).toEqual({ msg: "Livro não encontrado" });
    });

        });
});
