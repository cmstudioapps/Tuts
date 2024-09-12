

fetch('https://cm-tube-default-rtdb.firebaseio.com/feed.json')
  .then(response => response.json())
  .then(data => {
    // Defina as cores
    let color = ["red", "blue", "greenyellow", "orange"];

    // Obtém as chaves e as inverte
    let chaves = Object.keys(data).reverse();

    // Itera sobre as chaves na ordem invertida
    chaves.forEach(key => {
      // Seleciona uma cor aleatória
      let colorSelect = Math.floor(Math.random() * color.length);
      let selected = color[colorSelect];

      // Obtém os dados
      let dados = data[key];

      // Adiciona o valor ao elemento com id 'posters'
      document.getElementById("posters").innerHTML += `
        <div class="item">
          <div class="date">
            <span>${dados.Mes}</span>
            <span>${dados.Dia}</span>
          </div>
          <div class="info">
            <h2 style="color: ${selected}; font-weight: bold;">${dados.nome}</h2>
            <h4>${dados.conteudo}</h4>
          </div>
        </div>
        <hr>
      `;
    });
  })
  .catch(error => console.error('Erro ao buscar os dados:', error));
  
  
  /*document.getElementById("label").addEventListener("click", () => {
     
    document.getElementById("file").click()
     
  
  
  document.getElementById("file").addEventListener("change", () => {
     
 const reader = new FileReader()
 const r = reader.result
 
     
     
 let arquivo = document.getElementById("file").files[0]
 
reader.readAsDataURL(arquivo)
     console.log(arquivo)
let url = URL.createObjectURL(arquivo)
console.log(url)
localStorage.setItem("imagem",r)


})


  })
  
  */
  const date = new Date(); // Pega a data atual
const nomeDoMes = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date);
console.log(nomeDoMes); // Exibe "set" para setembro
  
  const mes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
console.log(mes); // Exibe "setembro"
  
  let dia = date.getDate()
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
    
   nomeAleatorio = gerarIdAleatorio(10)
    
    let conteudo = document.getElementById("entrada").value
    
    let nome = localStorage.getItem("nome")
    
   
   const dados = {
     
     nome: nome,
     conteudo: '<pe>'+conteudo+'<pe>',
     Dia: dia,
     Mes: nomeDoMes
     
   }
    if (conteudo && !conteudo.includes("<")) {
    fetch('https://cm-tube-default-rtdb.firebaseio.com/feed/'+nomeAleatorio+'.json', {
      
      method: "PATCH",
      body: JSON.stringify(dados)
      
      
      
      
    })
    

  .then(respons => respons.json())
  .then(dat => {
    
    location.reload()
    
    
  })
    } else {
      
      alert("Seu código tem caracteres suspeitos")
      
    }
  }