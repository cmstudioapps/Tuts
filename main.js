if (!localStorage.getItem("nome") || localStorage.getItem("nome").includes("gosar")) {
  let Nm = prompt("Seu nome");
  localStorage.setItem("nome", Nm);
}

let rolar = 1;
let color = ["red", "blue", "greenyellow", "orange"];
let itemColors = {};  // Objeto para armazenar cores associadas aos itens

fetch('https://cm-tube-default-rtdb.firebaseio.com/feed.json')
  .then(rs => rs.json())
  .then(dt => {
    let msgs = Object.keys(dt);

    msgs.forEach(e => {
      // Atribui uma cor aleatória a cada item uma única vez
      if (!itemColors[e]) {
        let colorSelect = Math.floor(Math.random() * color.length);
        itemColors[e] = color[colorSelect];
      }
    });
  });

setInterval(() => {
  fetch('https://cm-tube-default-rtdb.firebaseio.com/feed.json')
    .then(response => response.json())
    .then(data => {
      console.log(rolar);

      // Transforma o objeto em um array e ordena pelo timestamp (do mais recente ao mais antigo)
      let itensOrdenados = Object.keys(data).map(key => ({
        key: key,
        ...data[key]
      })).sort((a, b) => b.timestamp - a.timestamp);

      // Limpa o elemento antes de adicionar novos itens
      document.getElementById("posters").innerHTML = '';

      // Itera sobre os itens ordenados
      itensOrdenados.forEach(item => {
        // Seleciona a cor já atribuída para o item
        let selected = itemColors[item.key];

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

        if (rolar === 1) {
          rolar = 0;

          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            });
            console.log(rolar);
          }, 500);
        }
      });
    })
    .catch(error => console.error('Erro ao buscar os dados:', error));
}, 2000);

const date = new Date();
const nomeDoMes = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date);
const mes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
let dia = date.getDate();
let nomeAleatorio;

function gerarIdAleatorio(tamanho) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let resultado = '';
  for (let i = 0; i < tamanho; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
}

function enviar() {
  let date = new Date();
  nomeAleatorio = gerarIdAleatorio(10);
  let conteudo = document.getElementById("entrada").value;
  let nome = localStorage.getItem("nome");

  let timestamp = date.getTime();

  const dados = {
    nome: nome,
    conteudo: `<pe>${conteudo}<pe>`,
    Dia: date.getDate(),
    Mes: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date),
    hora: date.getHours(),
    minutos: date.getMinutes(),
    timestamp: timestamp
  };

  if (conteudo && !conteudo.includes("<")) {
    fetch('https://cm-tube-default-rtdb.firebaseio.com/feed/' + nomeAleatorio + '.json', {
      method: "PATCH",
      body: JSON.stringify(dados)
    })
      .then(response => response.json())
      .then(() => {
        document.getElementById("entrada").value = "";
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