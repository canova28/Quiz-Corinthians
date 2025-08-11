const quiz = document.getElementById("quiz");
const tempoSpan = document.getElementById("temporizador");
const pontuacaoSpan = document.getElementById("pontuacao");

let faseAtual = 0;
let perguntaAtual = 0;
let tempoRestante = 0;
let intervalo;
let pontuacao = 0;

// Lista com imagem de transição para cada pergunta
const imagensTransicao = [
  "./IMG/timao.jpg", "./IMG/plc.png", "./IMG/depay.png", "./IMG/liberta.png", "./IMG/liberta2.png",
  "./IMG/mosque.png", "./IMG/cpm].png", "./IMG/neoq.png", "./IMG/sheik.png", "./IMG/fiel.png",
  "./IMG/tite.png", "./IMG/brasile.png", "./IMG/chelsea.png", "./IMG/jo.png", "./IMG/tite2.png",
  "./IMG/baixo.png", "./IMG/alex.png", "./IMG/romarinho.png", "./IMG/semi.png", "./IMG/julio.png",
  "./IMG/rive.png", "./IMG/invicto.png", "./IMG/gaspar.png", "./IMG/cosp.png", "./IMG/carioca.png",
  "./IMG/1991.png", "./IMG/silvio.png", "./IMG/falta.png", "./IMG/gobi.png", "./IMG/gol.png"
];

function iniciarFase() {
  perguntaAtual = 0;
  tempoRestante = 30;
  atualizarTemporizador();
  atualizarPontuacao();
  intervalo = setInterval(() => {
    tempoRestante--;
    atualizarTemporizador();
    if (tempoRestante <= 0) {
      pontuacao--;
      mostrarTransicao(() => {
        proximaPergunta();
      });
    }
  }, 1000);
  mostrarPergunta();
}

function atualizarTemporizador() {
  tempoSpan.innerText = "Tempo restante: " + tempoRestante + "s";
}

function atualizarPontuacao() {
  pontuacaoSpan.innerText = "Pontuação: " + pontuacao;
}

function mostrarPergunta() {
  const fase = fases[faseAtual];
  const pergunta = fase.perguntas[perguntaAtual];

  let html = "<h1>" + fase.titulo + "</h1>";
  html += "<div class='pergunta'>" + pergunta.texto + "</div>";
  html += "<div class='imagem'>";
  if (pergunta.imagem) {
    html += "<img src='" + pergunta.imagem + "' />";
  } else {
    html += "<br><br><br>";
  }
  html += "</div>";
  html += "<div class='alternativas'>";

  for (let i = 0; i < pergunta.opcoes.length; i++) {
    html += "<button onclick='responder(" + i + ")'>" +
            String.fromCharCode(65 + i) + ") " + pergunta.opcoes[i] +
            "</button>";
  }

  html += "</div>";

  quiz.innerHTML = html;
}

function responder(indice) {
  const pergunta = fases[faseAtual].perguntas[perguntaAtual];
  const correta = pergunta.correta;
  const botoes = document.querySelectorAll(".alternativas button");

  // Desabilita os botões
  botoes.forEach(btn => btn.disabled = true);

  if (indice === correta) {
    pontuacao += 2;
    atualizarPontuacao();
    mostrarTransicao(() => {
      proximaPergunta();
    });
  } else {
    pontuacao--;
    atualizarPontuacao();

    // Marca o botão clicado como errado
    botoes[indice].classList.add("errado");

    // Destaca o botão correto
    botoes[correta].classList.add("correta");

    // Espera 2 segundos e segue
    setTimeout(() => {
      mostrarTransicao(() => {
        proximaPergunta();
      });
    }, 2000);
  }
}

function mostrarTransicao(callback) {
  clearInterval(intervalo);

  // pega o índice absoluto da pergunta no quiz inteiro
  const imgIndex = perguntaGlobalIndex();
  const imgSrc = imagensTransicao[imgIndex] || "IMG/logo.png";

  quiz.innerHTML = `
    <div class="imagem-transicao">
      <img src="${imgSrc}" alt="Transição" />
    </div>
  `;

  setTimeout(() => {
    callback();
  }, 3000); // espera 3 segundos
}

function perguntaGlobalIndex() {
  let index = 0;
  for (let i = 0; i < faseAtual; i++) {
    index += fases[i].perguntas.length;
  }
  return index + perguntaAtual;
}

function proximaPergunta() {
  perguntaAtual++;
  if (perguntaAtual >= fases[faseAtual].perguntas.length) {
    faseAtual++;
    clearInterval(intervalo);
    if (faseAtual >= fases.length) {
      tempoSpan.innerText = "";
      pontuacaoSpan.innerText = "";

      // Função para obter o ranking baseado na pontuação
      function obterRanking(pontos) {
        if (pontos <= 5) return "Você nem corinthiano é!";
        if (pontos <= 15) return "Melhor estudar mais o Timão.";
        if (pontos <= 30) return "Você é um torcedor médio.";
        if (pontos <= 45) return "Quase um especialista no Timão!";
        if (pontos <= 60) return "Você é um torcedor do coração!";
        return "Você é o maior fã do Corinthians!";
      }

      const mensagemRanking = obterRanking(pontuacao);

      quiz.innerHTML = `
        <h1 class='fim-quiz'>Parabéns! Você completou o quiz do Timão!<br>
        Pontuação final: ${pontuacao}</h1>
        <h2 class='ranking'>${mensagemRanking}</h2>
      `;
    } else {
      iniciarFase();
    }
  } else {
    tempoRestante = 30;
    atualizarTemporizador();
    intervalo = setInterval(() => {
      tempoRestante--;
      atualizarTemporizador();
      if (tempoRestante <= 0) {
        pontuacao--;
        mostrarTransicao(() => {
          proximaPergunta();
        });
      }
    }, 1000);
    mostrarPergunta();
  }
}

// Início via botão
document.getElementById("botao-iniciar").addEventListener("click", () => {
  document.getElementById("tela-inicial").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  iniciarFase();
});

