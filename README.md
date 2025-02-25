1 - Crie uma pasta para inserir o Projeto com o nome "api-autores-livros"
2 - Crie uma subpasta com o nome de "backend"
3 - insira o arquivo server.js que contem o código da API
4 - Abra o vscode

Como executar
No termnal do VS Code digite os comandos abaixo:

Inicialize o projeto e instale as dependências
npm init -y
npm install express mongoose body-parser jsonwebtoken cors

Inicie o MongoDB
mongod --dbpath ./data
OU
docker run -d -p 27017:27017 --name mongo-api mongo

Inicie seu servidor Node.js
node server.js
OU
para recarregar automaticamente ao salvar:
npm install -g nodemon
nodemon server.js

---------------------------------------------

Como Testar o projeto
Abra o Postman

Passo 1: Gerar Token JWT
Antes de testar os endpoints protegidos, é necessário gerar um token JWT.

Abra o Postman e selecione POST

Digite a URL: http://localhost:3000/api/login

Vá até a aba Body e selecione raw
Escolha JSON e insira esse JSON no corpo da requisição:
{
  "usuario": "admin"
}
Clique em Send
Você receberá um token JWT como resposta. Copie ele.
--------------------------------------------------------------------------------
Passo 2: Criar um Autor
Agora crie um autor.

Selecione POST e digite a URL: http://localhost:3000/api/v1/autor
Vá até a aba Headers e adicione:
Key: Authorization
Value: Bearer SEU_TOKEN (Substitua SEU_TOKEN pelo token copiado anteriormente).

No Body, selecione raw e JSON e insira:
{
  "numero": 1,
  "nome": "J.K. Rowling"
}
Clique em Send.
Se der certo, você verá o autor criado na resposta.
--------------------------------------------------------------------------------
Passo 3: Criar um Livro

Selecione POST e insira a URL: http://localhost:3000/api/v1/autor/1/livro
Vá até Headers e adicione a autenticação JWT como antes.
No Body, selecione raw e JSON e insira:
{
  "titulo": "Harry Potter",
  "edicao": "1",
  "isbn": "123456789",
  "categoria": "Fantasia"
}
Clique em Send para cadastrar o livro.
-------------------------------------------------------------------------------

Passo 4: Buscar um Autor
Selecione GET e digite: http://localhost:3000/api/v1/autor/1
Clique em Send e veja os dados do autor.
-------------------------------------------------------------------------------

Passo 5: Listar Todos os Livros de um Autor
Selecione GET e insira: http://localhost:3000/api/v1/autor/1/livro/
Clique em Send para visualizar os livros cadastrados.





