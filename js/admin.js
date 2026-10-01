/* =========================================================
   FRUTLOG - ADMINISTRADOR
   Funcionarios, usuarios ativos, mapa e indicadores.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  FrutLog.verificarSessao(["admin"]);
  FrutLog.configurarLogout();
  gerarMatriculaFuncionario();
  carregarSessoes();
  configurarCadastroFuncionario();
  carregarGraficos();
});

const sessoesAtivas = [
  {
    matricula: "1001",
    nome: "Carlos",
    perfil: "engenheiro",
    ultimoAcesso: "13/09/2026 08:10",
    ultimaAtividade: "13/09/2026 09:20",
    status: "Online",
  },
  {
    matricula: "2001",
    nome: "Marina",
    perfil: "tecnico",
    ultimoAcesso: "13/09/2026 07:45",
    ultimaAtividade: "13/09/2026 09:28",
    status: "Online",
  },
  {
    matricula: "3001",
    nome: "Roberto",
    perfil: "admin",
    ultimoAcesso: "12/09/2026 16:40",
    ultimaAtividade: "12/09/2026 17:05",
    status: "Offline",
  },
];

const colheitaAnual = [
  { ano: "2022", toneladas: 72 },
  { ano: "2023", toneladas: 84 },
  { ano: "2024", toneladas: 79 },
  { ano: "2025", toneladas: 91 },
  { ano: "2026", toneladas: 105 },
];

const climaMensal = [
  { mes: "Jan", temperatura: 33 },
  { mes: "Fev", temperatura: 32 },
  { mes: "Mar", temperatura: 31 },
  { mes: "Abr", temperatura: 30 },
  { mes: "Mai", temperatura: 29 },
  { mes: "Jun", temperatura: 28 },
  { mes: "Jul", temperatura: 29 },
  { mes: "Ago", temperatura: 31 },
  { mes: "Set", temperatura: 32 },
  { mes: "Out", temperatura: 33 },
  { mes: "Nov", temperatura: 32 },
  { mes: "Dez", temperatura: 31 },
];

let proximaMatriculaFuncionario = 4001;

function gerarMatriculaFuncionario() {
  const campoMatricula = document.getElementById("funcionario-matricula");

  if (campoMatricula) {
    campoMatricula.value = proximaMatriculaFuncionario;
  }
}

function carregarSessoes() {
  const tabela = document.getElementById("tabela-sessoes");
  if (!tabela) return;

  tabela.innerHTML = sessoesAtivas.map((sessao) => {
    const statusClasse = sessao.status.toLowerCase();

    return `
      <tr>
        <td>${sessao.matricula}</td>
        <td>${sessao.nome}</td>
        <td>${sessao.perfil}</td>
        <td>${sessao.ultimoAcesso}</td>
        <td>${sessao.ultimaAtividade}</td>
        <td>
          <span class="status-usuario ${statusClasse}">
            <span class="bolinha-status" aria-hidden="true"></span>
            ${sessao.status}
          </span>
        </td>
      </tr>
    `;
  }).join("");
}

function configurarCadastroFuncionario() {
  const formulario = document.getElementById("form-funcionario");
  const mensagem = document.getElementById("mensagem-funcionario");

  formulario?.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(formulario));

    try {
      // TODO: confirmar endpoint com o backend.
      // await FrutLog.apiFetch("/funcionarios", { method: "POST", body: JSON.stringify(dados) });
      console.info("Funcionario preparado para API:", dados);
      mensagem.textContent = "Cadastro de funcionario preparado para envio ao backend.";
      mensagem.className = "mensagem-feedback sucesso";
      proximaMatriculaFuncionario += 1;
      formulario.reset();
      gerarMatriculaFuncionario();
    } catch (erro) {
      mensagem.textContent = erro.message;
      mensagem.className = "mensagem-feedback erro";
    }
  });
}

function carregarGraficos() {
  if (typeof Chart === "undefined") {
    return;
  }

  const graficoColheita = document.getElementById("grafico-colheita-anual");
  const graficoClima = document.getElementById("grafico-clima-mensal");

  if (graficoColheita) {
    new Chart(graficoColheita, {
      type: "bar",
      data: {
        labels: colheitaAnual.map((item) => item.ano),
        datasets: [{
          label: "Toneladas",
          data: colheitaAnual.map((item) => item.toneladas),
          backgroundColor: "#2e7d32",
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  if (graficoClima) {
    new Chart(graficoClima, {
      type: "line",
      data: {
        labels: climaMensal.map((item) => item.mes),
        datasets: [
          {
            label: "Temperatura (C)",
            data: climaMensal.map((item) => item.temperatura),
            borderColor: "#c62828",
            backgroundColor: "rgba(198, 40, 40, 0.12)",
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });
  };
}

/* =========================================================
  FRUTLOG - CHATBOT FLUTUANTE
  ========================================================= */

document.addEventListener("DOMContentLoaded", configurarChatbot);

function configurarChatbot() {
  const botaoToggle = document.getElementById("chatbot-toggle");
  const card = document.getElementById("chatbot-card");
  const botaoFechar = document.getElementById("chatbot-fechar");
  const formulario = document.getElementById("chatbot-form");
  const campo = document.getElementById("chatbot-input");
  const areaMensagens = document.getElementById("chatbot-mensagens");

  if (!botaoToggle || !card) return;

  let saudacaoEnviada = false;

  function abrir() {
    card.hidden = false;
    botaoToggle.setAttribute("aria-expanded", "true");
    if (!saudacaoEnviada) {
      adicionarMensagem("Olá! Sou o assistente do FrutLog. Como posso ajudar?", "bot");
      saudacaoEnviada = true;
    }
    campo.focus();
  }

  function fechar() {
    card.hidden = true;
    botaoToggle.setAttribute("aria-expanded", "false");
    botaoToggle.focus();
  }

  function adicionarMensagem(texto, tipo) {
    const msg = document.createElement("div");
    msg.className = `chatbot-msg ${tipo}`;
    msg.textContent = texto; // textContent evita injeção de HTML
    areaMensagens.appendChild(msg);
    areaMensagens.scrollTop = areaMensagens.scrollHeight;
    return msg;
  }

  async function obterResposta(pergunta) {
    // TODO: trocar pela chamada real ao backend/IA, por exemplo:
    // const resposta = await FrutLog.apiFetch("/chat", {
    //   method: "POST",
    //   body: JSON.stringify({ mensagem: pergunta }),
    // });
    // return resposta.texto;

    await new Promise((resolve) => setTimeout(resolve, 700));
    return `Você disse: "${pergunta}". (Resposta simulada, falta conectar ao backend.)`;
  }

  botaoToggle.addEventListener("click", () => (card.hidden ? abrir() : fechar()));
  botaoFechar.addEventListener("click", fechar);

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !card.hidden) fechar();
  });

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const texto = campo.value.trim();
    if (!texto) return;

    adicionarMensagem(texto, "usuario");
    campo.value = "";

    const digitando = adicionarMensagem("Digitando...", "bot digitando");

    try {
      const resposta = await obterResposta(texto);
      digitando.remove();
      adicionarMensagem(resposta, "bot");
    } catch (erro) {
      digitando.remove();
      adicionarMensagem("Não consegui responder agora. Tente novamente.", "bot");
    }
  });
}

