import express from "express"; // Importa o framework Express para criar a aplicação web
import multer from "multer"; // Importa o módulo Multer para lidar com o upload de arquivos
import cors from "cors";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js"; // Importa as funções para lidar com as rotas de posts do controlador

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

// Configura o armazenamento para o upload de arquivos no Windows
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define o diretório de destino para os arquivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Define o nome do arquivo como o nome original
  }
});

const upload = multer({ dest: "./uploads" , storage}); // Cria uma instância do Multer com a configuração de armazenamento

// Para Linux ou Mac, a configuração é mais simples
// const upload = multer({ dest: "./uploads"})

const routes = (app) => {
  // Habilita o parser JSON para lidar com requisições com corpo em formato JSON
  app.use(express.json()); 
  app.use(cors(corsOptions));
  // Rota para buscar todos os posts
  app.get("/posts", listarPosts);
  // Rota para criar um novo post
  app.post("/posts", postarNovoPost);
  // Rota para fazer upload de uma imagem
  app.post("/upload", upload.single("imagem"), uploadImagem);

  app.put("/upload/:id", atualizarNovoPost);
}

export default routes; // Exporta a função de rotas para ser utilizada em outros módulos