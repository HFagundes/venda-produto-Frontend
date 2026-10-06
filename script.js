const API_URL = "http://localhost:5037/api";


// Criando uma função para testar a conexão com o backend. Essa função pode ser chamada quando o usuário 
// clicar em um botão específico na interface do usuário. A função pode fazer uma requisição simples para o backend e
// exibir uma mensagem de sucesso ou erro na tela.

// Assync serve para lidar com operações assíncronas, como requisições HTTP. A função testarConexao() faz uma requisição 
// GET para o endpoint /conexao/testar da API e exibe a mensagem de sucesso ou erro na tela.

async function testarConexao() {
// Seleciona o elemento HTML com o ID "mensagem" para exibir mensagens de status na tela.
const mensagem = document.getElementById("mensagem");

// Try é usado para tentar executar um bloco de código que pode gerar erros. Se ocorrer um erro, o controle é passado para o bloco catch.
try {

    mensagem.textContent = "Testando conexão...";

    const resposta = await fetch(`${API_URL}/conexao/testar`);

    if (!resposta.ok) {
        throw new Error("Erro ao conectar com a API.");
    }

    const dados = await resposta.json();

    mensagem.textContent = dados.mensagem;

    // Catch é usado para capturar e tratar erros que ocorrem no bloco try. Se ocorrer um erro, ele será exibido no console 
    // e uma mensagem de erro será exibida na tela.
} catch (erro) {

    console.error(erro);

    mensagem.textContent =
        "Não foi possível conectar com o backend.";
}
    // (Não está aqui, mas também possuimos o Finally, que é usado para executar um bloco de código 
    // independentemente de ocorrer um erro ou não. Ele é útil para liberar recursos ou realizar ações de limpeza após a execução do bloco try/catch.)
}


// Função para listar as vendas. Essa função faz uma requisição GET para o endpoint /vendas da API e exibe as vendas na tela.
//  Se não houver vendas, uma mensagem informando que não há vendas será exibida.

async function listarVendas() {

// Seleciona os elementos HTML com os IDs "vendas" e "mensagem" para exibir as vendas e mensagens de status na tela.
const container = document.getElementById("vendas");
const mensagem = document.getElementById("mensagem");


// Nesse try catch, a função tenta buscar as vendas da API e exibi-las na tela. Se ocorrer um erro, ele será capturado e uma mensagem de erro será exibida.
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


    // Itera sobre cada venda recebida da API e cria um card para exibir as informações da venda na tela. 
    // Cada card contém informações como ID da venda, data, status, valor total e os itens da venda.

    vendas.forEach(venda => {

        // Cria o card da venda
        const cardVenda = document.createElement("div");

        cardVenda.classList.add("card-venda");


        // Monta os itens da venda na tela. 
        // Cada item da venda é exibido com informações como nome do produto, ID do item, ID do produto, quantidade, valor unitário e valor total do item.
        let itensHTML = "";

        // Exibe cada item da venda no card da venda. Para cada item, cria um bloco HTML com as informações do item.
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

//  Função para formatar valores monetários. Essa função recebe um valor numérico e o formata para o padrão brasileiro, com duas casas decimais e separador de milhar.

function formatarValor(valor) {

return Number(valor).toLocaleString("pt-BR", {

    minimumFractionDigits: 2,

    maximumFractionDigits: 2

});

}


// Formata a data para o padrão brasileiro.

function formatarData(data) {

return new Date(data).toLocaleString("pt-BR");

}


// Evento de clique para o botão de testar conexão. Quando o botão é clicado, a função testarConexao() é chamada.

document
.getElementById("btnConexao")
.addEventListener("click", testarConexao);

// Evento de clique para o botão de listar vendas. Quando o botão é clicado, a função listarVendas() é chamada.
document
.getElementById("btnVendas")
.addEventListener("click", listarVendas);