import { useState } from 'react';
import Menu from '../componentes/Menu'

function CadastroCliente() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNasc, setDataNasc] = useState('');
    // const [endereco, setEndereco] = useState({
    //     rua: '',
    //     bairro: '',
    //     cidade: '',
    //     cep: '',
    //     numero: ''
    // });

    const handleSubmit = (e) => {
        e.preventDefault(); // impede recarregar a pa´gina
        console.log("Dados do cliente: ", {nome, email});

        // limpeza do form após salvar
        setNome('');
        setEmail('');
        setCpf('')
        setDataNasc('');
    };

    return (
        <div>
            <Menu />
            <form onSubmit={handleSubmit} action="">
                <fieldset>
                    <label htmlFor="name">Nome:</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                    <label htmlFor="email">E-mail:<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                    
                    <label htmlFor="cpf">CPF:</label>
                    <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />

                    <label htmlFor="dataNasc">Data nascimento:</label>
                    <input type="date" value={dataNasc} onChange={(e) => setDataNasc(e.target.value)} />

                </fieldset>

                {/* <fieldset>
                    <label htmlFor="rua">Rua:</label>
                    <input type="text" value={endereco.rua}  />
                </fieldset> */}
                <fieldset>
                    <button type="submit">Salvar</button>
                </fieldset>
            </form>
            <h1>Cadastro de Cliente</h1>
        </div>
    );
}

export default CadastroCliente;