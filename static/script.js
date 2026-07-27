// 1. Nosso ARRAY que vai armazenar a lista de objetos de retorno
const listaDeUsuarios = [];

const form = document.getElementById('formUsuario');
const containerCards = document.getElementById('container-cards');

// 2. Escuta o evento de submit do formulário
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Impede o recarregamento da página

  // 3. Criamos um OBJETOCONSTRUTO com os valores dos inputs
  // Note a conversão da idade para Number (i32 no Rust)
  const dadosFormulario = {
    nome: document.getElementById('nome').value,
    idade: parseInt(document.getElementById('idade').value, 10),
    profissao: document.getElementById('profissao').value
  };

  try {
    // 4. API Fetch: Converte o objeto JS para string JSON e envia via POST
    const resposta = await fetch('http://127.0.0.1:3000/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosFormulario) // Transforma Objeto JS -> String JSON
    });

    if (!resposta.ok) {
      throw new Error('Falha na resposta do servidor Rust');
    }

    // 5. Recebe o JSON de volta do Rust e transforma em Objeto JS
    const usuarioRetornado = await resposta.json();

    // 6. Adiciona o novo objeto no nosso ARRAY
    listaDeUsuarios.push(usuarioRetornado);

    // 7. Atualiza os cards na tela
    renderizarCards();

    // Limpa o formulário
    form.reset();

  } catch (erro) {
    console.error('Erro na requisição:', erro);
  }
});

// 8. Função para ler o ARRAY e renderizar o HTML dos cards
function renderizarCards() {
  // Limpa o container para não duplicar
  containerCards.innerHTML = '';

  // Percorre o ARRAY de objetos usando forEach
  listaDeUsuarios.forEach((usuario) => {
    const card = document.createElement('div');
    card.className = 'card';

    // Monta o HTML do card usando as propriedades do OBJETO
    card.innerHTML = `
      <h3>${usuario.nome}</h3>
      <p><strong>ID:</strong> ${usuario.id}</p>
      <p><strong>Idade:</strong> ${usuario.idade} anos</p>
      <p><strong>Profissão:</strong> ${usuario.profissao}</p>
      <small style="color: #4caf50;">${usuario.mensagem}</small>
    `;

    // Adiciona o card criado dentro do DOM
    containerCards.appendChild(card);
  });
}

