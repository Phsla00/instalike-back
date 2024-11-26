import express from "express"; // Importa o módulo Express para criar o servidor web.
import routes from "./src/routes/postsRoutes.js";

// Cria uma instância do Express para iniciar o servidor.
const app = express(); 
app.use(express.static("uploads"))
routes(app);

// Inicia o servidor na porta 3000 e exibe uma mensagem no console quando o servidor estiver ouvindo.
app.listen(3000, () => { 
  console.log("Servidor escutando...");
});