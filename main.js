// Importando os módulos do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';

// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyByqIaq_UAXArSSK2gdl0jiNs-tTQiQYNo",
    authDomain: "cm-tube.firebaseapp.com",
    databaseURL: "https://cm-tube-default-rtdb.firebaseio.com",
    projectId: "cm-tube",
    storageBucket: "cm-tube.appspot.com",
    messagingSenderId: "720070431030",
    appId: "1:720070431030:web:39d53225c8fd6e42a9a397",
    measurementId: "G-PC04HSMRFS"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
let enviar = document.getElementById("enviar")
if (!localStorage.getItem("nome") || localStorage.getItem("nome").includes("gosar")) {
    let Nm = prompt("Seu nome");
    localStorage.setItem("nome", Nm);
}

let rolar = 1;
let color = ["red", "blue", "greenyellow", "orange"];
let itemColors = {};
let geral;
let msgAntiga = localStorage.getItem("msgAntiga");

fetch('https://cm-tube-default-rtdb.firebaseio.com/feed.json')
    .then(rs => rs.json())
    .then(dt => {
        geral = dt;

        if (geral != msgAntiga) {
            msgAntiga = geral;
            localStorage.setItem("msgAntiga", msgAntiga);
        }

        let msgs = Object.keys(dt);

        msgs.forEach(e => {
            if (!itemColors[e]) {
                let colorSelect = Math.floor(Math.random() * color.length);
                itemColors[e] = color[colorSelect];
            }
        });
    });

setInterval(() => {
    fetch('https://cm-tube-default-rtdb.firebaseio.com/feed/.json')
        .then(response => response.json())
        .then(data => {
            let itensOrdenados = Object.keys(data).map(key => ({
                key: key,
                ...data[key]
            })).sort((a, b) => b.timestamp - a.timestamp);

            document.getElementById("posters").innerHTML = '';

            itensOrdenados.forEach(item => {
                let selected = itemColors[item.key];

                if (!item.nome.includes("gosar") && !item.nome.includes("pau")) {
                    document.getElementById("posters").insertAdjacentHTML('afterbegin', `
                        <div class="item">
                            <div class="date">
                                <span>${item.Mes}</span>
                                <span>${item.Dia}</span>
                            </div>
                            <div class="info">
                                <h2 style="color: ${selected}; font-weight: bold;">${item.nome}</h2>
                                <h4>${item.conteudo}</h4>
                                ${item.imagemURL ? `<img id='imgg' src="${item.imagemURL}" alt="imagem"/>` : ''}
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

// Função para enviar dados
enviar.addEventListener("click", async function() {
    let date = new Date();
    nomeAleatorio = gerarIdAleatorio(10);
    let conteudo = document.getElementById("entrada").value;
    let nome = localStorage.getItem("nome");
    let imagem = document.getElementById("file").files[0]; // Pega o arquivo de imagem
    let timestamp = date.getTime();

    const dados = {
        nome: nome,
        conteudo: `<pe>${conteudo}<pe>`,
        Dia: date.getDate(),
        Mes: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date),
        hora: date.getHours(),
        minutos: date.getMinutes(),
        timestamp: timestamp,
        imagemURL: "" // Este campo será preenchido após o upload da imagem
    };

    if (conteudo && !conteudo.includes("<")) {
        if (imagem) {
            const imagemRef = ref(storage, `imagens/${nomeAleatorio}-${imagem.name}`);
            await uploadBytes(imagemRef, imagem).then(async snapshot => {
                const urlImagem = await getDownloadURL(snapshot.ref);
                dados.imagemURL = urlImagem; // Adiciona a URL da imagem aos dados
            });
        }

        fetch('https://cm-tube-default-rtdb.firebaseio.com/feed/' + nomeAleatorio + '.json', {
            method: "PATCH",
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(() => {

               window.scrollTo({
                 top: document.body.scrollHeight,
                     behavior: 'smooth'
                        });
            document.getElementById("entrada").value = "";
            document.getElementById("file").value = ""; // Limpa o campo de imagem
        })
        .catch(error => {
            Swal.fire({
                title: 'Erro',
                text: 'Houve um erro no envio da mensagem, verifique sua internet e tente novamente!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    } else {
        Swal.fire({
            title: 'Inválido',
            text: 'Seu texto contém caracteres inválidos. Por favor, revise!',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
})