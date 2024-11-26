import fs from "fs"; // Importa o módulo fs para realizar operações com o sistema de arquivos
import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js"; // Importa as funções para obter e criar posts do modelo de dados
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts (req, res) { 
  // Chama a função para buscar todos os posts no banco de dados
  const posts = await getTodosPosts(); 
  // Envia os posts encontrados como resposta em formato JSON com status 200 (OK)
  res.status(200).json(posts); 
}

export async function postarNovoPost(req, res) {
  const novoPost = req.body; // Obtém os dados do novo post enviados no corpo da requisição
  try {
    // Chama a função para criar um novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Envia o post criado como resposta em formato JSON com status 200 (OK)
    res.status(200).json(postCriado);
  } catch(erro) {
    // Caso ocorra algum erro, loga o erro no console e envia uma mensagem de erro ao cliente
    console.error(erro.message);
    res.status(500).json({"Erro":"Falha na requisição."});
  }
}

export async function uploadImagem(req, res) {
  // Cria um objeto com os dados do novo post, incluindo o nome do arquivo da imagem
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  };

  try {
    // Chama a função para criar um novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Constrói o novo nome do arquivo da imagem, usando o ID do post criado
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    // Renomeia o arquivo da imagem para o novo nome
    fs.renameSync(req.file.path, imagemAtualizada);
    // Envia o post criado como resposta em formato JSON com status 200 (OK)
    res.status(200).json(postCriado);
  } catch(erro) {
    // Caso ocorra algum erro, loga o erro no console e envia uma mensagem de erro ao cliente
    console.error(erro.message);
    res.status(500).json({"Erro":"Falha na requisição."});
  }
}

export async function atualizarNovoPost(req, res) {
  const id = req.params.id; // Obtém os dados do novo post enviados no corpo da requisição
  const urlImagem = `http://localhost:3000/${id}.png`;
  
  try {
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imgBuffer);
    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    }
    // Chama a função para criar um novo post no banco de dados
    const postCriado = await atualizarPost(id, post);
    // Envia o post criado como resposta em formato JSON com status 200 (OK)
    res.status(200).json(postCriado);
  } catch(erro) {
    // Caso ocorra algum erro, loga o erro no console e envia uma mensagem de erro ao cliente
    console.error(erro.message);
    res.status(500).json({"Erro":"Falha na requisição."});
  }
}