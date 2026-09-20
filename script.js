const API_URL = "http://localhost:5037/api";

// ======================================================
// TESTAR CONEXÃO
// ======================================================

async function testarConexao() {

const mensagem = document.getElementById("mensagem");

try {

    mensagem.textContent = "Testando conexão...";

    const resposta = await fetch(`${API_URL}/conexao/testar`);

    if (!resposta.ok) {
        throw new Error("Erro ao conectar com a API.");
    }

    const dados = await resposta.json();

    mensagem.textContent = dados.mensagem;

} catch (erro) {

    console.error(erro);

    mensagem.textContent =
        "Não foi possível conectar com o backend.";
}

}

// ======================================================
// LISTAR VENDAS
// ======================================================

async function listarVendas() {

const container = document.getElementById("vendas");
const mensagem = document.getElementById("mensagem");

try {

    mensagem.textContent = "Carregando vendas...";

    const resposta = await fetch(`${API_URL}/vendas`);

    if (!resposta.ok) {
        throw new Error("Erro ao buscar as vendas.");
    }

    const vendas = await resposta.json();

    console.log("Vendas recebidas:", vendas);

    container.innerHTML = "";

    if (vendas.length === 0) {

        container.innerHTML = `
            <p class="mensagem-inicial">
                Nenhuma venda encontrada.
            </p>
        `;

        mensagem.textContent = "";

        return;
    }


    // Percorre cada venda
    vendas.forEach(venda => {

        // Cria o card da venda
        const cardVenda = document.createElement("div");

        cardVenda.classList.add("card-venda");


        // Monta os itens da venda
        let itensHTML = "";


        venda.itens.forEach(item => {

            itensHTML += `
                <div class="item-venda">

                    <h3>${item.nomeProduto}</h3>

                    <p>
                        <strong>ID do item:</strong>
                        ${item.idItemVenda}
                    </p>

                    <p>
                        <strong>ID do produto:</strong>
                        ${item.idProduto}
                    </p>

                    <p>
                        <strong>Quantidade:</strong>
                        ${item.quantidade}
                    </p>

                    <p>
                        <strong>Valor unitário:</strong>
                        R$ ${formatarValor(item.valorUnitario)}
                    </p>

                    <div class="valor-total">
                        Total do item:
                        R$ ${formatarValor(item.valorTotalItem)}
                    </div>

                </div>
            `;

        });


        // Monta o card completo da venda
        cardVenda.innerHTML = `

            <div class="cabecalho-venda">

                <h2>
                    Venda #${venda.idVenda}
                </h2>

                <p>
                    <strong>Data:</strong>
                    ${formatarData(venda.dataHora)}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${venda.ativa ? "Ativa" : "Cancelada"}
                </p>

                <div class="valor-venda">
                    Valor total:
                    R$ ${formatarValor(venda.valorTotal)}
                </div>

            </div>


            <div class="itens-venda">

                <h3>Itens da venda</h3>

                ${itensHTML}

            </div>

        `;


        container.appendChild(cardVenda);

    });


    mensagem.textContent =
        `${vendas.length} venda(s) encontrada(s).`;


} catch (erro) {

    console.error(erro);

    mensagem.textContent =
        "Não foi possível carregar as vendas.";

    container.innerHTML = `
        <p class="mensagem-inicial">
            Erro ao conectar com o backend.
        </p>
    `;
}

}

// ======================================================
// FORMATAR VALOR
// ======================================================

function formatarValor(valor) {

return Number(valor).toLocaleString("pt-BR", {

    minimumFractionDigits: 2,

    maximumFractionDigits: 2

});

}

// ======================================================
// FORMATAR DATA
// ======================================================

function formatarData(data) {

return new Date(data).toLocaleString("pt-BR");

}

// ======================================================
// EVENTOS DOS BOTÕES
// ======================================================

document
.getElementById("btnConexao")
.addEventListener("click", testarConexao);

document
.getElementById("btnVendas")
.addEventListener("click", listarVendas);