import { useState } from 'react';
import Menu from '../componentes/Menu'

function Home() {
    const [buscaNome, setBuscaNome] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    const mockPedidos = [
        { id: 1, cliente: 'Amanda', descricao: 'Teclado Mecânico', valor: 350.00, data: '2026-06-25' },
        { id: 2, cliente: 'Carlos', descricao: 'Monitor 24"', valor: 800.00, data: '2026-06-26' },
        { id: 3, cliente: 'Beatriz', descricao: 'Mouse sem fio', valor: 120.00, data: '2026-06-28' }
    ];

    const [pedidosExibidos, setPedidosExibidos] = useState(mockPedidos);

    const handlePesquisar = () => {
        const resultado = mockPedidos.filter((pedido) => {
            const matchNome = pedido.cliente.toLowerCase().includes(buscaNome.toLowerCase());

            const matchDataIni = dataInicio ? pedido.data >= dataInicio : true;

            const matchDataFim = dataFim ? pedido.data <= dataFim : true;

            return matchNome && matchDataIni && matchDataFim;
        })
        setPedidosExibidos(resultado);
    };

    return (
        <div>
            <Menu />
            <h1>Consulta de Pedidos (HOME)</h1>
            <input type="text" placeholder='Buscar por nome do cliente...' value={buscaNome} onChange={(e) => setBuscaNome(e.target.value)} />

            <label htmlFor="dataIni">Data Início:</label>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />

            <label htmlFor="dataFim">Data fim:</label>
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />

            <button onClick={handlePesquisar} >Pesquisar</button>

            <ul>
                { pedidosExibidos.map((pedido) => (
                    <li key={pedido.id}>
                        <strong>Pedido #{pedido.id}</strong>: {pedido.cliente} comprou {pedido.descricao} por R$ {pedido.valor} em {pedido.data}
                    </li>
                )) }
            </ul>
        </div>
    );
}

export default Home;