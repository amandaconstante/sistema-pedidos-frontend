import { useState, useEffect } from 'react';
import Menu from '../componentes/Menu'

function CadastroPedido() {
    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);

    const [clienteId, setClienteId] = useState('');
    const [clienteSelecionado, setClienteSelecionado] = useState('');

    const [produtoId, setProdutoId] = useState('');
    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    
    const [quantidade, setQuantidade] = useState(1);
    const [sacola, setSacola] = useState([]);

    // const mockClientes = [
    //     { id: 1, nome: 'Bea', email: 'bea@email.com', cpf: '000.888.111-85' },
    //     { id: 2, nome: 'Luca', email: 'luca@mail.com', cpf: '000.000.111.10' },
    //     { id: 3, nome: 'Lili', email: 'lili@mail.com', cpf: '111.111.111-00' },
    //     { id: 4, nome: 'Joana', email: 'joana@mail.com', cpf: '001.100.010-01'}
    // ];
    // const mockProdutos = [
    //     { id: 1, descricao: "Mouse Gamer Sem Fio RGB", valorUnitario: 189.90 },
    //     { id: 2, descricao: "Teclado Mecânico Switch Blue", valorUnitario: 349.00 },
    //     { id: 3, descricao: "Monitor Monitor UltraWide 29'", valorUnitario: 1250.00 },
    //     { id: 4, descricao: "Headset Estéreo com Microfone", valorUnitario: 219.99 },
    //     { id: 5, descricao: "Webcam Full HD 1080p", valorUnitario: 155.50 }
    // ];

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const resClientes = await fetch('http://localhost:8080/clientes');
                const resProdutos = await fetch('http://localhost:8080/produtos');
                
                if (resClientes.ok) {
                    const dadosClientes = await resClientes.json();
                    // O Spring Page devolve a lista dentro de "content"
                    setClientes(dadosClientes.content || dadosClientes);
                }
                
                if (resProdutos.ok) {
                    const dadosProdutos = await resProdutos.json();
                    setProdutos(dadosProdutos.content || dadosProdutos);
                }
            } catch (error) {
                console.error("Erro ao carregar dados iniciais:", error);
            }
        };
        carregarDados();
    }, []);

    const buscarCliente = (idSelecionado) => {
        const encontrado = clientes.find(cli => cli.id === Number(idSelecionado));
        console.log('encontrado = ', encontrado);
        setClienteSelecionado(encontrado);
    }

    const buscarProduto = (idProdutoSelecionado) => {
        const encontrado = produtos.find(prod => prod.id === Number(idProdutoSelecionado));
        setProdutoSelecionado(encontrado);
    }

    const adicionarItem = () => {
        console.log("chamou adicionarITem");
        if (!produtoSelecionado) return;

        const itemJaExiste = sacola.find(item => item.id === produtoSelecionado.id);

        if (itemJaExiste) {
            const pedidoAtualizado = sacola.map(item => {
                if (item.id === produtoSelecionado.id) {
                    const novaQuant = Number(item.quantidade) + Number(quantidade);
                    return {
                        ...item,
                        quantidade: novaQuant,
                        valorTotalItem: novaQuant * item.preco
                    };
                }
                return item;
            });
            setSacola(pedidoAtualizado);
        } else {
            const novoItem = {
            id: produtoSelecionado.id,
            nome: produtoSelecionado.nome,
            descricao: produtoSelecionado.descricao,
            preco: produtoSelecionado.preco,
            quantidade: quantidade,
            valorTotalItem: produtoSelecionado.preco * quantidade
        };
        console.log("produtoSelecionado.preco = ", produtoSelecionado.preco);
        console.log("valorTotalItem = ", novoItem.valorTotalItem);
        setSacola([...sacola, novoItem]);
        }

        setProdutoSelecionado('');
        setProdutoId('');
        setQuantidade(1);
    };

    const excluirItem = (idProduto) => {
        const pedidoAtualizado = sacola.filter(item => item.id !== idProduto);
        setSacola(pedidoAtualizado);
    }

    const salvarPedido = async () => {
        if (!clienteId || sacola.length === 0) {
            alert("Selecione um cliente e adicione itens na sacola!");
            return;
        }

        const itensDto = sacola.map(item => ({
            produtoId: item.id,
            quantidade: item.quantidade
        }));

        const payload = {
            clienteId: Number(clienteId),
            itens: itensDto
        };

        try {
            const resposta = await fetch('http://localhost:8080/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (resposta.ok) {
                alert("Pedido realizado com sucesso!");
                setSacola([]);
                setClienteId('');
                setClienteSelecionado('');
            } else {
                alert("Erro ao salvar o pedido. Verifique o console.");
            }
        } catch (erro) {
            console.error("Erro ao conectar com a API", erro);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <Menu />
            <h1>Cadastro de Pedido</h1>
            <form >
                <fieldset >
                    <label htmlFor="clienteId">Cliente: </label>
                    <select name="cliente" id="clienteId" value={clienteId} onChange={(e) => {setClienteId(e.target.value); buscarCliente(e.target.value)}}>
                        <option value="" disabled>Selecione um cliente</option>
                        {clientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id} >
                                {cliente.nome}
                            </option>
                        ))}
                    </select>
                </fieldset>

                {clienteSelecionado && ( <fieldset >
                    <input type="text" disabled value={clienteSelecionado.nome}/>
                    <input type="text" disabled value={clienteSelecionado.email} />
                    <input type="text disabled" disabled value={clienteSelecionado.cpf} />
                </fieldset> )}

                <fieldset>
                    <label htmlFor="produtoId">Produto: </label>
                    <select name="produto" id="produtoId" value={produtoId} onChange={(e) => {setProdutoId(e.target.value); buscarProduto(e.target.value)}}>
                        <option value="" disabled>Selecione um produto</option>
                        {produtos.map((produto) => (
                            <option key={produto.id} value={produto.id}>{produto.nome} - R$ {produto.preco}</option>
                        ))}
                    </select>
                </fieldset>
                
                {produtoSelecionado && (<fieldset>
                    <input type="text" disabled value={produtoSelecionado.nome} />
                    <input type="text" disabled value={produtoSelecionado.descricao} />
                    <input type="text" disabled value={`R$ ${produtoSelecionado.preco}`} />
                    <input type="number" min="1" step="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />

                    <button type='button' onClick={adicionarItem} >Adicionar produto</button>
                </fieldset>)}

                {sacola.length > 0 && (<fieldset>
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Descrição</th>
                                <th>Qtd</th>
                                <th>Total</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sacola.map((produto) => (
                                <tr key={produto.id}>
                                    <td>{produto.nome}</td>
                                    <td>{produto.descricao}</td>
                                    <td>{produto.quantidade}</td>
                                    <td>{produto.valorTotalItem.toFixed(2)}</td>
                                    <td>
                                        <button type='button' onClick={() => excluirItem(produto.id)}>Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </fieldset>)}

                {sacola.length > 0 && (<fieldset>
                    <label htmlFor="totalPedido">Valor Total do Pedido R$ </label>
                    <input type="text" disabled value={sacola.reduce((acumulador, item) => acumulador + item.valorTotalItem, 0).toFixed(2)} />

                    <button type="button" onClick={salvarPedido} style={{marginLeft: '10px', background: 'green', color: 'white'}}>
                            Finalizar Pedido
                    </button>
                </fieldset>)}
                
            </form>
            
            
        </div>
    );
}

export default CadastroPedido;