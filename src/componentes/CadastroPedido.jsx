import { useState } from 'react';
import Menu from '../componentes/Menu'

function CadastroPedido() {
    const [clienteId, setClienteId] = useState('');
    const [data, setData] = useState('');
    const [clienteSelecionado, setClienteSelecionado] = useState('');

    const [itens, setItens] = useState([]);

    // const [descricaoItem, setDescricaoItem] = useState('');
    // const [valorUnitario, setValorUnitario] = useState('');
    const [produtoId, setProdutoId] = useState('');
    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [sacola, setSacola] = useState([]); // sacola = pedido
    const [quantidade, setQuantidade] = useState(1);

    const mockClientes = [
        { id: 1, nome: 'Bea', email: 'bea@email.com', cpf: '000.888.111-85' },
        { id: 2, nome: 'Luca', email: 'luca@mail.com', cpf: '000.000.111.10' },
        { id: 3, nome: 'Lili', email: 'lili@mail.com', cpf: '111.111.111-00' },
        { id: 4, nome: 'Joana', email: 'joana@mail.com', cpf: '001.100.010-01'}
    ];
    const mockProdutos = [
        { id: 1, descricao: "Mouse Gamer Sem Fio RGB", valorUnitario: 189.90 },
        { id: 2, descricao: "Teclado Mecânico Switch Blue", valorUnitario: 349.00 },
        { id: 3, descricao: "Monitor Monitor UltraWide 29'", valorUnitario: 1250.00 },
        { id: 4, descricao: "Headset Estéreo com Microfone", valorUnitario: 219.99 },
        { id: 5, descricao: "Webcam Full HD 1080p", valorUnitario: 155.50 }
    ];

    const buscarCliente = (idSelecionado) => {
        console.log('id cliente selecionado: ', idSelecionado);
        const encontrado = mockClientes.find(cli => cli.id === Number(idSelecionado));
        console.log('encontrado = ', encontrado);
        setClienteSelecionado(encontrado);
    }

    const buscarProduto = (idProdutoSelecionado) => {
        console.log('idProd selecionado = ', idProdutoSelecionado);
        const encontrado = mockProdutos.find(prod => prod.id === Number(idProdutoSelecionado));
        console.log('prod escolhido: ', encontrado);
        setProdutoSelecionado(encontrado);
    }

    const adicionarItem = () => {
        if (!produtoSelecionado) return;

        const itemJaExiste = sacola.find(item => item.id === produtoSelecionado.id);

        if (itemJaExiste) {
            const pedidoAtualizado = sacola.map(item => {
                if (item.id === produtoSelecionado.id) {
                    const novaQuant = Number(item.quantidade) + Number(quantidade);
                    return {
                        ...item,
                        quantidade: novaQuant,
                        valorTotalItem: novaQuant * item.valorUnitario
                    };
                }
                return item;
            });
            setSacola(pedidoAtualizado);
        } else {
            const novoItem = {
            id: produtoSelecionado.id,
            descricao: produtoSelecionado.descricao,
            valorUnitario: produtoSelecionado.valorUnitario,
            quantidade: quantidade,
            valorTotalItem: produtoSelecionado.valorUnitario * quantidade
        };

        setSacola([...sacola, novoItem]);
        console.log('sacola = ', sacola);
        }

        
        // const valorPedido = sacola.reduce((acumulador, item) => acumulador + item.valorTotalItem, 0);
        //setValorPedido(valorSacola);

        setProdutoSelecionado('');
        setProdutoId('');
        setQuantidade(1);
    };

    const excluirItem = (idProduto) => {
        const pedidoAtualizado = sacola.filter(item => item.id !== idProduto);
        console.log('lista pós excluir = ', pedidoAtualizado);
        setSacola(pedidoAtualizado);
    }


    return (
        <>
            <Menu />
            <h1>Cadastro de Pedido</h1>
            <form action="">
                <fieldset>
                    <label htmlFor="clienteId">Cliente: </label>
                    <select name="cliente" id="clienteId" value={clienteId} onChange={(e) => {setClienteId(e.target.value); buscarCliente(e.target.value)}}>
                        <option value="" disabled>Selecione uma opção</option>
                        {mockClientes.map((cliente) => (
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
                    <select name="produto" id="prodId" value={produtoId} onChange={(e) => {setProdutoId(e.target.value); buscarProduto(e.target.value)}}>
                        <option value="" disabled>Selecione um produto</option>
                        {mockProdutos.map((produto) => (
                            <option key={produto.id} value={produto.id}>{produto.id} - {produto.descricao}</option>
                        ))}
                    </select>
                </fieldset>
                {produtoSelecionado && (<fieldset>
                    <input type="text" disabled value={produtoSelecionado.id} />
                    <input type="text" disabled value={produtoSelecionado.descricao} />
                    <input type="text" disabled value={produtoSelecionado.valorUnitario} />
                    <input type="number" min="1" step="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />

                    <button type='button' onClick={adicionarItem}>Adicionar produto</button>
                </fieldset>)}

                {sacola.length > 0 && (<fieldset>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Descrição</th>
                                <th>Quantididade</th>
                                <th>R$</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sacola.map((produto) => (
                                <tr key={produto.id}>
                                    <td>{produto.id}</td>
                                    <td>{produto.descricao}</td>
                                    <td>{produto.quantidade}</td>
                                    <td>{produto.valorTotalItem}</td>
                                    <td>
                                        <button type='button' onClick={() => excluirItem(produto.id)}>Excluir item</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </fieldset>)}
                {sacola.length > 0 && (<fieldset>
                    <label htmlFor="totalPedido">Valor Pedido R$ </label>
                    <input type="text" disabled value={sacola.reduce((acumulador, item) => acumulador + item.valorTotalItem, 0)} />
                </fieldset>)}
                
            </form>
            
            
        </>
    );
}

export default CadastroPedido;