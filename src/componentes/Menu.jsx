import { Link } from 'react-router-dom';

function Menu () {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/pedido">Novo Pedido</Link></li>
                <li><Link to="/cliente">Novo Cliente</Link></li>
            </ul>
        </nav>
    );
}

export default Menu;