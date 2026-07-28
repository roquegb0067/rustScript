const visor = document.getElementById('visor');
let usuarioJSON = null;
let postBusca = null;
//transforma variáveis dos inputs em JSON 
async function Pesquisa() {
  const searchInput = document.getElementById('search').value
  const busca = { busca: searchInput };
  postBusca = JSON.stringify(busca);
  
  try {
    // 3. Faz o envio via POST
    const respostaBusca = await fetch('http://127.0.0.1:3000/api/search', { // Altere para a URL correta da sua rota no Axum
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Essencial para o Axum aceitar o Json<>
      },
      body: postBusca // envia o json
    });
    
    if (!respostaBusca.ok) {
      throw new Error('Nada encontrado! Busque de novo...');
    }

    const dadosBusca = await respostaBusca.json();
    console.log('Resposta do Search:', dadosBusca);
  } catch (erro) {
    console.error('Erro na busca:', erro);
  }
}

function run() {
  
  const idade = document.getElementById('idade').value;
  const nome = document.getElementById('nome').value;
  const texto = document.getElementById('texto').value;
  
  
  
  //transforma em objeto
  const usuario = { idade: Number(idade), nome, texto };
  console.log(usuario);
  //transforma em JSON
  usuarioJSON = JSON.stringify(usuario);
  card();
};

async function card() {
  console.log(usuarioJSON);
  //o usuarioJSON é a variável que contem o JSON, JSON.parse para desestruturar
  const usuarioJson = JSON.parse(usuarioJSON);
  //cria a constante com variáveis para usar, depois a constante que pegou o valor do Json
  const { idade, nome, texto } = usuarioJson;
  console.log(idade);
  console.log(nome);
  console.log(texto);
  visor.innerHTML = `
    <div>
   <h2>${nome}</h1>
   <h3>${idade}</h3>
   <p>${texto}</p>
  </div>
  `
  console.log(typeof idade);
  
  document.getElementById('nameUser').innerText = nome;
  //inicio da api
  try {
    // 3. Faz o envio via POST
    const resposta = await fetch('http://127.0.0.1:3000/api/usuarios', { // Altere para a URL correta da sua rota no Axum
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Essencial para o Axum aceitar o Json<>
      },
      body: usuarioJSON // envia o json
    });
    
    if (!resposta.ok) {
      throw new Error('Erro ao enviar os dados');
    }
    
    // Se o seu Axum retornar alguma resposta, você pode ler aqui:
    const dadosResposta = await resposta.json();
    console.log('Sucesso! Resposta do Rust:', dadosResposta);
    
    //"abrindo" o objeto do rust
    const {
      nome: nomeReturnoRust,
      idade: idadeUsuarioReturn
    } = dadosResposta;
    console.log(nomeReturnoRust, idadeUsuarioReturn);
    
  } catch (erro) {
    console.error('Erro:', erro);
  }
}
