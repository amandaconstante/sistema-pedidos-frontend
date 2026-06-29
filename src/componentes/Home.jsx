import { useState } from 'react';
import Menu from '../componentes/Menu'

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
            const resposta = await fetch(`http://localhost:8080/pedidos?${params.toString()}`);
            
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
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif'}}>
            <Menu />
            <h1 style={{ color: '#333', borderBottom: '2px solid #240378', paddingBottom: '10px' }}>
                Consulta de Pedidos
            </h1>

            <fieldset>
                <legend>Filtros de Busca</legend>
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

                <button type="button" onClick={() => handlePesquisar(0)}>Pesquisar</button>
            </fieldset>

            {foiPesuisado && (
                <div>
                    <h2>Pedidos: </h2>
                    
                    {pedidosExibidos.length === 0 ? (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhum pedido encontrado com estes filtros.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                            {pedidosExibidos.map((pedido) => (
                                <div key={pedido.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                                        <strong style={{ color: '#007BFF' }}>Pedido #{pedido.id}</strong>
                                        <span style={{ fontSize: '0.9em', color: '#888' }}>{pedido.dataCriacao}</span>
                                    </div>
                                    <p style={{ margin: '5px 0' }}><strong>Cliente:</strong> {pedido.clienteNome}</p>
                                    <p style={{ margin: '5px 0' }}><strong>Status:</strong> {pedido.status}</p>
                                    <p style={{ margin: '10px 0 0 0', fontSize: '1.2em', color: 'green', fontWeight: 'bold' }}>
                                        Total: R$ {pedido.valorTotal.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* PAGINAÇÃO */}
                    {totalPaginas > 1 && (
                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center' }}>
                            <button 
                                disabled={paginaAtual === 0} 
                                onClick={() => handlePesquisar(paginaAtual - 1)}
                                style={{ padding: '8px 15px', cursor: paginaAtual === 0 ? 'not-allowed' : 'pointer' }}
                            >
                                Anterior
                            </button>
                            
                            <span style={{ fontWeight: 'bold' }}> Página {paginaAtual + 1} de {totalPaginas} </span>
                            
                            <button 
                                disabled={paginaAtual === totalPaginas - 1} 
                                onClick={() => handlePesquisar(paginaAtual + 1)}
                                style={{ padding: '8px 15px', cursor: paginaAtual === totalPaginas - 1 ? 'not-allowed' : 'pointer' }}
                            >
                                Próximo
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* <ul>
                {pedidosExibidos.length === 0 && <li>Nenhum pedido encontrado com estes filtros.</li>}

                {pedidosExibidos.map((pedido) => (
                    <li key={pedido.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                        <strong>Pedido #{pedido.id}</strong> <br/>
                        ID Cliente: {pedido.clienteId} <br/>
                        Total: R$ {pedido.valorTotal.toFixed(2)} <br/>
                        Data: {formatarData(pedido.dataCriacao)} <br/>
                        Status: <em>{pedido.status}</em>
                    </li>
                ))}
            </ul>
            {totalPaginas > 1 && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button 
                        disabled={paginaAtual === 0} 
                        onClick={() => handlePesquisar(paginaAtual - 1)}
                    >
                        Anterior
                    </button>
                    
                    <span> Página {paginaAtual + 1} de {totalPaginas} </span>
                    
                    <button 
                        disabled={paginaAtual === totalPaginas - 1} 
                        onClick={() => handlePesquisar(paginaAtual + 1)}
                    >
                        Próximo
                    </button>
                </div>
            )} */}
        </div>
    );
}

export default Home;