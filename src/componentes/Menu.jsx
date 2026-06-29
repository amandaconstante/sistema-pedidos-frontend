import { Link, useLocation } from 'react-router-dom';
import './Menu.css';

function Menu () {
    const location = useLocation();

    const getLinkClass = (path) => {
        return location.pathname === path ? 'nav-link active' : 'nav-link';
    };

    return (
        <nav className='navbar'>
            <ul className="navbar-links">
                <li><Link to="/" className={getLinkClass('/')}>Pedidos</Link></li>
                <li><Link to="/pedido" className={getLinkClass('/pedido')}>Novo Pedido</Link></li>
                <li><Link to="/cliente" className={getLinkClass('/cliente')}>Novo Cliente</Link></li>
            </ul>
        </nav>
    );
}

export default Menu;