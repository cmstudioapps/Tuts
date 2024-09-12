if(!localStorage.getItem("nome") || localStorage.getItem("nome").includes("gosar")) {
  let Nm = prompt("Seu nome");
  localStorage.setItem("nome", Nm);
}

setInterval(()=> {

fetch('https://cm-tube-default-rtdb.firebaseio.com/feed.json')
  .then(response => response.json())
  .then(data => {
    // Defina as cores
    let color = ["red", "blue", "greenyellow", "orange"];

    // Transforma o objeto em um array e ordena pelo timestamp (do mais recente ao mais antigo)
    let itensOrdenados = Object.keys(data).map(key => ({
      key: key,
      ...data[key]
    })).sort((a, b) => b.timestamp - a.timestamp);  // Ordena do mais recente ao mais antigo

    // Limpa o elemento antes de adicionar novos itens
    document.getElementById("posters").innerHTML = '';

    // Itera sobre os itens ordenados
    itensOrdenados.forEach(item => {
      // Seleciona uma cor aleatória
      let colorSelect = Math.floor(Math.random() * color.length);
      let selected = color[colorSelect];

      // Verifica a condição antes de exibir
      if (!item.nome.includes("gosar")) {
        // Adiciona o conteúdo ao topo usando insertAdjacentHTML
        document.getElementById("posters").insertAdjacentHTML('afterbegin', `
          <div class="item">
            <div class="date">
              <span>${item.Mes}</span>
              <span>${item.Dia}</span>
            </div>
            <div class="info">
              <h2 style="color: ${selected}; font-weight: bold;">${item.nome}</h2>
              <h4>${item.conteudo}</h4>
              <p>${item.hora} : ${item.minutos}</p>
            </div>
          </div>
          <hr>
        `);
      }
    });
  })
  .catch(error => console.error('Erro ao buscar os dados:', error));
},2000)

const date = new Date(); // Pega a data atual
const nomeDoMes = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date);
console.log(nomeDoMes); // Exibe "set" para setembro

const mes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
console.log(mes); // Exibe "setembro"

let dia = date.getDate();
let nomeAleatorio;

function gerarIdAleatorio(tamanho) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let resultado = '';
  const comprimento = caracteres.length;
  for (let i = 0; i < tamanho; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * comprimento));
  }
  return resultado;
}

function enviar() {
  nomeAleatorio = gerarIdAleatorio(10);
  let conteudo = document.getElementById("entrada").value;
  let nome = localStorage.getItem("nome");
  
  // Adiciona o timestamp em milissegundos
  let timestamp = date.getTime(); 

  const dados = {
    nome: nome,
    conteudo: '<pe>' + conteudo + '<pe>',
    Dia: dia,
    Mes: nomeDoMes,
    hora: date.getHours(),
    minutos: date.getMinutes(),
    timestamp: timestamp  // Adiciona timestamp aqui
  };

  if (conteudo && !conteudo.includes("<")) {
    fetch('https://cm-tube-default-rtdb.firebaseio.com/feed/' + nomeAleatorio + '.json', {
      method: "PATCH",
      body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
      
      Swal.fire({
  title: 'Enviado',
  text: 'Sua mensagem foi entregue',
  icon: 'success',
  confirmButtonText: 'OK'
});
      
    });
  } else {
    alert("Seu texto tem caracteres suspeitos");
  }
}