const prompt = require('prompt-sync')();
const produtos = [];
const clientes = [];

function cadastrarProduto(nome, preco, estoque) {
    produtos.push({ id: produtos.length + 1, nome, preco, estoque });
}

function listarProdutos() {
    console.log("Produtos disponíveis:");
    produtos.forEach(p => console.log(`${p.id} - ${p.nome} | Preço: R$${p.preco} | Estoque: ${p.estoque}`));
}

function cadastrarCliente(nome, email) {
    clientes.push({ id: clientes.length + 1, nome, email, historico: [] });
}

function realizarCompra(nomeCliente, itens) {
    const cliente = clientes.find(c => c.nome === nomeCliente);
    if (!cliente) return console.log("Cliente não encontrado.");

    let total = 0;
    const detalhesCompra = [];

    for (const item of itens) {
        const produto = produtos.find(p => p.id === item.idProduto);
        if (!produto || produto.estoque < item.quantidade) {
            console.log(`Produto inválido ou estoque insuficiente: ${item.idProduto}`);
            continue;
        }

        const subtotal = produto.preco * item.quantidade;
        total += subtotal;
        produto.estoque -= item.quantidade;

        detalhesCompra.push({
            produto: produto.nome,
            quantidade: item.quantidade,
            subtotal
        });
    }

    const desconto = total > 100 ? total * 0.1 : 0;
    const totalFinal = total - desconto;

    const pedido = {
        data: new Date(),
        itens: detalhesCompra,
        total,
        desconto,
        totalFinal
    };

    cliente.historico.push(pedido);
    console.log("Compra realizada com sucesso!");
    console.log(pedido);
}

function mostrarHistorico(nomeCliente) {
    const cliente = clientes.find(c => c.nome === nomeCliente);
    if (!cliente) return console.log("Cliente não encontrado.");

    console.log(`Histórico de compras de ${cliente.nome}:`);
    cliente.historico.forEach((pedido, index) => {
        console.log(`Pedido ${index + 1} - ${pedido.data.toLocaleString()} - Total: R$${pedido.totalFinal}`);
    });
}

function buscarProdutoPorNome(nome) {
    const resultados = produtos.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()));
    console.log("Resultados da busca:");
    resultados.forEach(p => console.log(`${p.id} - ${p.nome} | R$${p.preco}`));
}

function relatorioVendas() {
    let totalVendas = 0;
    clientes.forEach(cliente => {
        cliente.historico.forEach(pedido => {
            totalVendas += pedido.totalFinal;
        });
    });
    console.log(`Total de vendas realizadas: R$${totalVendas.toFixed(2)}`);
}

function init() {
    console.log("Bem-vindo à Loja Virtual! Aproveite nosso desconto de 10% em compras acima de R$100.");
    console.log("Use as funções para gerenciar produtos, clientes e vendas. Digite o número da função para executá-la.");
    const menu = `
1. Cadastrar Produto
2. Listar Produtos
3. Buscar Produto por Nome
4. Cadastrar Cliente
5. Realizar Compra
6. Mostrar Histórico
7. Relatório de Vendas
`;
    console.log(menu);
    let escolha = prompt("Digite o número da função que deseja executar (ou 'sair' para encerrar): ");
    while (escolha.toLowerCase() !== 'sair') {
        switch (escolha) {
            case '1':
                const nomeProduto = prompt("Nome do Produto: ");
                const precoProduto = parseFloat(prompt("Preço do Produto: "));
                const estoqueProduto = parseInt(prompt("Estoque do Produto: "));
                cadastrarProduto(nomeProduto, precoProduto, estoqueProduto);
                break;
            case '2':
                listarProdutos();
                break;
            case '3':
                const nomeBusca = prompt("Nome do Produto para buscar: ");
                buscarProdutoPorNome(nomeBusca);
                break;
            case '4':
                const nomeCliente = prompt("Nome do Cliente: ");
                const emailCliente = prompt("Email do Cliente: ");
                cadastrarCliente(nomeCliente, emailCliente);
                break;
            case '5':
                const nomeClienteCompra = prompt("Nome do Cliente: ");
                const itensCompra = [];
                let adicionarMais = 's';
                while (adicionarMais.toLowerCase() === 's') {
                    const nomeProdutoCompra = prompt("Nome do Produto: ");
                    const quantidadeCompra = parseInt(prompt("Quantidade: "));
                    const produto = produtos.find(p => p.nome === nomeProdutoCompra);
                    if (produto) {
                        itensCompra.push({ idProduto: produto.id, quantidade: quantidadeCompra });
                    } else {
                        console.log("Produto não encontrado.");
                    }
                    adicionarMais = prompt("Adicionar mais produtos? (s/n): ");
                }
                realizarCompra(nomeClienteCompra, itensCompra);
                break;
            case '6':
                const nomeClienteHistorico = prompt("Nome do Cliente: ");
                mostrarHistorico(nomeClienteHistorico);
                break;
            case '7':
                relatorioVendas();
                break;
            default:
                console.log("Opção inválida.");
        }
        escolha = prompt("Digite o número da função que deseja executar (ou 'sair' para encerrar): ");
    }
    console.log("Encerrando o sistema. Até mais!");
}
init();
