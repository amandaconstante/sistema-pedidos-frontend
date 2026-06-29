import { useState } from 'react';
import Menu from '../componentes/Menu'
import './Home.css'

function Home() {
    const [buscaNome, setBuscaNome] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [pedidosExibidos, setPedidosExibidos] = useState([]);

    const [foiPesuisado, setFoiPesquisado] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);

    const [modalAberto, setModalAberto] = useState(false);
    const [pedidoDetalhe, setPedidoDetalhe] = useState(null);
    const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);

    const handlePesquisar = async (paginaAlvo = 0) => {
        const params = new URLSearchParams();
        if (buscaNome) params.append('nomeCliente', buscaNome);
        if (dataInicio) params.append('dataInicio', dataInicio);
        if (dataFim) params.append('dataFim', dataFim);

        setFoiPesquisado(true);
        params.append('page', paginaAlvo);
        params.append('size', 9);

        try {
            const resposta = await fetch(`https://sistema-pedidos-production-47b7.up.railway.app/pedidos?${params.toString()}`);
            
            if (resposta.ok) {
                const dados = await resposta.json();
                setPedidosExibidos(dados.content || dados);
                setPaginaAtual(dados.number);
                setTotalPaginas(dados.totalPages);
            } else {
                console.error("Erro na resposta da API");
            }
        } catch (erro) {
            console.error("Erro ao buscar pedidos: ", erro);
        }
    };

    const buscarDetalhesPedido = async (id) => {
        setModalAberto(true);
        setCarregandoDetalhe(true);
        
        try {
            const resposta = await fetch(`https://sistema-pedidos-production-47b7.up.railway.app/pedidos/${id}`);
            if (resposta.ok) {
                const dados = await resposta.json();
                setPedidoDetalhe(dados);
            } else {
                alert("Erro ao buscar detalhes do pedido.");
                setModalAberto(false);
            }
        } catch (erro) {
            console.error(erro);
            alert("Erro de conexão.");
            setModalAberto(false);
        } finally {
            setCarregandoDetalhe(false);
        }
    };

    const fecharModal = () => {
        setModalAberto(false);
        setPedidoDetalhe(null);
    };

    const formatarData = (dataString) => {
        if (!dataString) return '';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    return (
        <div className="container-pagina">
            <Menu />
            <h1 >
                Consulta de Pedidos
            </h1>

            <form className="form-cadastro">
                <fieldset className="sessao-form">
                    <legend style={{ color:'rgba(103, 103, 105, 0.97)' }}>Filtros de Busca</legend>
                    <input
                        type="text"
                        placeholder='Buscar por nome do cliente...'
                        value={buscaNome}
                        onChange={(e) => setBuscaNome(e.target.value)}
                    />
                    <label htmlFor="dataIni">Data Início:</label>
                    <input
                        type="date"
                        id="dataIni"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                    />
                    <label htmlFor="dataFim">Data fim:</label>
                    <input
                        type="date"
                        id="dataFim"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                    />
                    <button type="button" className="btn btn-adicionar" onClick={() => handlePesquisar(0)}>Pesquisar</button>
                </fieldset>
            </form>

            {foiPesuisado && (
                <div>
                    <h2>Pedidos: </h2>
                    
                    {pedidosExibidos.length === 0 ? (
                        <p className="mensagem-vazia">Nenhum pedido encontrado com estes filtros.</p>
                    ) : (
                        <div className="pedidos-grid">
                            {pedidosExibidos.map((pedido) => (
                                <div key={pedido.id} className="pedido-card">
                                    <div className="pedido-card-header">
                                        <strong className="pedido-titulo">Pedido #{pedido.id}</strong>
                                        <span className="pedido-data">{pedido.dataCriacao}</span>
                                    </div>
                                    <p className="pedido-texto"><strong>Cliente:</strong> {pedido.clienteNome}</p>
                                    <p className="pedido-texto"><strong>Status:</strong> {pedido.status}</p>
                                    <p className="pedido-total">
                                        Total: R$ {pedido.valorTotal.toFixed(2)}
                                    </p>

                                    <button className="btn-detalhes" onClick={() => buscarDetalhesPedido(pedido.id)} >
                                        Detalhar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* PAGINAÇÃO */}
                    {totalPaginas > 1 && (
                        <div className="paginacao-container">
                            <button 
                                disabled={paginaAtual === 0} 
                                onClick={() => handlePesquisar(paginaAtual - 1)}
                                className="btn-paginacao"
                            >
                                Anterior
                            </button>
                            
                            <span className="paginacao-info"> Página {paginaAtual + 1} de {totalPaginas} </span>
                            
                            <button 
                                disabled={paginaAtual === totalPaginas - 1} 
                                onClick={() => handlePesquisar(paginaAtual + 1)}
                                className="btn-paginacao"
                            >
                                Próximo
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* === ESTRUTURA DO MODAL === */}
            {modalAberto && (
                <div className="modal-overlay" onClick={fecharModal}>
                    {/* O e.stopPropagation() impede que clicar dentro do modal feche ele */}
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-fechar-modal" onClick={fecharModal}>&times;</button>
                        
                        {carregandoDetalhe ? (
                            <p style={{ textAlign: 'center', margin: '40px 0' }}>Buscando detalhes no servidor...</p>
                        ) : pedidoDetalhe ? (
                            <>
                                <h2 style={{ marginBottom: '5px' }}>Detalhes do Pedido #{pedidoDetalhe.id}</h2>
                                <p style={{ color: '#666', marginTop: '0' }}>Data: {pedidoDetalhe.dataCriacao}</p>
                                
                                <div style={{ backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '4px', margin: '15px 0' }}>
                                    <p style={{ margin: '5px 0' }}><strong>Cliente:</strong> {pedidoDetalhe.clienteNome}</p>
                                    <p style={{ margin: '5px 0' }}><strong>Status:</strong> {pedidoDetalhe.status}</p>
                                </div>

                                <h3>Itens do Pedido:</h3>
                                <table className="tabela-itens">
                                    <thead>
                                        <tr>
                                            <th>Produto</th>
                                            <th>Qtd</th>
                                            <th>Preço Un.</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidoDetalhe.itens?.map((item, index) => (
                                            <tr key={item.id || index}>
                                                <td>{item.nomeProduto}</td>
                                                <td>{item.quantidade}</td>
                                                <td>R$ {item.precoUnitario.toFixed(2)}</td>
                                                <td>R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <h2 className="pedido-total" style={{ textAlign: 'right', fontSize: '1.5em' }}>
                                    Valor Total: R$ {pedidoDetalhe.valorTotal.toFixed(2)}
                                </h2>
                            </>
                        ) : (
                            <p>Não foi possível carregar os dados.</p>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

export default Home;