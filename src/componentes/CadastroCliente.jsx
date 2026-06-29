import { useState } from 'react';
import Menu from '../componentes/Menu'

function CadastroCliente() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNasc, setDataNasc] = useState('');
    const [endereco, setEndereco] = useState({
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        cep: ''
    });

    const handleEnderecoChange = (e) => {
        const { name, value } = e.target;
        setEndereco(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault(); // impede recarregar a pa´gina
    //     console.log("Dados do cliente: ", {nome, email});

    //     // limpeza do form após salvar
    //     setNome('');
    //     setEmail('');
    //     setCpf('')
    //     setDataNasc('');
    // };

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        const [ano, mes, dia] = dataNasc.split('-');
        const dataNascFormatada = `${dia}/${mes}/${ano}`;

        const payload = {
            nome,
            email,
            cpf,
            dataNasc: dataNascFormatada,
            endereco
        };

        try {
            const resposta = await fetch('http://localhost:8080/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (resposta.ok) {
                alert("Cliente cadastrado com sucesso!");
                // Limpeza geral do form
                setNome('');
                setEmail('');
                setCpf('');
                setDataNasc('');
                setEndereco({ logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '', cep: '' });
            } else {
                const erroData = await resposta.json();
                console.error("Erros de validação:", erroData);
                alert("Erro ao cadastrar. Verifique se preencheu tudo corretamente.");
            }
        } catch (erro) {
            console.error("Erro ao conectar com a API: ", erro);
            alert("Erro de conexão com o servidor. O back-end está rodando?");
        }
    };


    return (
        <div>
            <Menu />
            <h1>Cadastro de Cliente</h1>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Dados Pessoais</legend>

                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />

                    <label htmlFor="email">E-mail:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    
                    <label htmlFor="cpf">CPF:</label>
                    <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} required />

                    <label htmlFor="dataNasc">Data nascimento:</label>
                    <input type="date" id="dataNasc" value={dataNasc} onChange={(e) => setDataNasc(e.target.value)} required />

                </fieldset>

                <fieldset>
                    <legend>Endereço</legend>
                    <label htmlFor="logradouro">Rua (Logradouro):</label>
                    <input type="text" name="logradouro" id="logradouro" value={endereco.logradouro} onChange={handleEnderecoChange} required />
                    
                    <label htmlFor="numero">Número:</label>
                    <input type="text" name="numero" id="numero" value={endereco.numero} onChange={handleEnderecoChange} />

                    <label htmlFor="complemento">Complemento:</label>
                    <input type="text" name="complemento" id="complemento" value={endereco.complemento} onChange={handleEnderecoChange} />

                    <label htmlFor="bairro">Bairro:</label>
                    <input type="text" name="bairro" id="bairro" value={endereco.bairro} onChange={handleEnderecoChange} required />

                    <label htmlFor="cidade">Cidade:</label>
                    <input type="text" name="cidade" id="cidade" value={endereco.cidade} onChange={handleEnderecoChange} required />

                    <label htmlFor="uf">UF (Estado):</label>
                    <input type="text" name="uf" id="uf" maxLength="2" value={endereco.uf} onChange={handleEnderecoChange} required />

                    <label htmlFor="cep">CEP:</label>
                    <input type="text" name="cep" id="cep" value={endereco.cep} onChange={handleEnderecoChange} required />
                </fieldset>

                <button type="submit">Salvar Cliente</button>
            </form>
        </div>
    );
}

export default CadastroCliente;