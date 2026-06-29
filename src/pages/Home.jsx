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
        </div>
    );
}

export default Home;