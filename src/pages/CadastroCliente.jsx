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

    const [erros, setErros] = useState({});

    const handleEnderecoChange = (e) => {
        const { name, value } = e.target;
        setEndereco(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (erros[name]) {
            setErros(prevErros => ({ ...prevErros, [name]: null }));
        }
    };

    const limpaErroPessoal = (campo) => {
        if (erros[campo]) {
            setErros(prevErros => ({ ...prevErros, [campo]: null }));
        }
    }

    const calcularIdade = (dataString) => {
        const hoje = new Date();
        const [ano, mes, dia] = dataString.split('-');
        // No JavaScript, o mês começa do 0 (Janeiro = 0, Fevereiro = 1...), por isso mes - 1
        const nascimento = new Date(ano, mes - 1, dia);
        
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const diferencaMes = hoje.getMonth() - nascimento.getMonth();
        
        // Se o mês atual for menor que o mês do aniversário, 
        // ou se estamos no mês do aniversário mas o dia de hoje é menor que o dia do nascimento,
        // significa que a pessoa ainda não fez aniversário neste ano (tira 1 ano da idade).
        if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return idade;
    };

    const buscarCepNaApi = async () => {
        // Tira o traço para consultar na API
        const cepLimpo = endereco.cep.replace(/\D/g, ''); 
        
        if (cepLimpo.length !== 8) return; 

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setEndereco(prev => ({
                    ...prev,
                    logradouro: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    uf: data.uf
                }));
                
                // Remove os erros visuais, já que a API preencheu certo
                setErros(prev => ({...prev, logradouro: null, bairro: null, cidade: null, uf: null, cep: null}));
            } else {
                setErros(prev => ({ ...prev, cep: "CEP não encontrado" }));
            }
        } catch (error) {
            console.error("Erro ao consultar ViaCEP:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setErros({});

        if (dataNasc) {
            const idade = calcularIdade(dataNasc);
            if (idade < 18) {
                setErros(prev => ({ ...prev, dataNasc: "O cliente deve ter 18 anos ou mais." }));
                return; 
            }
        }

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
            const resposta = await fetch('https://sistema-pedidos-production-47b7.up.railway.app/clientes', {
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
                setErros({});
            } else {
                const erroData = await resposta.json();
                
                if (Array.isArray(erroData)) {
                    const mapeamentoErros = {};
                    erroData.forEach(erro => {
                        // Se vier "endereco.cep", pega só a palavra "cep"
                        const nomeCampo = erro.campo.includes('.') ? erro.campo.split('.')[1] : erro.campo;
                        mapeamentoErros[nomeCampo] = erro.mensagem;
                    });
                    setErros(mapeamentoErros);
                }

                console.error("Erros de validação:", erroData);
                alert("Erro ao cadastrar. Verifique se preencheu tudo corretamente.");
            }
        } catch (erro) {
            console.error("Erro ao conectar com a API: ", erro);
            alert("Erro de conexão com o servidor.");
        }
    };


    return (
        <div className="container-pagina">
            <Menu />
            <h1>Cadastro de Cliente</h1>
            <form onSubmit={handleSubmit} className="form-cadastro">
                <fieldset className="sessao-form">
                    <legend style={{ color:'rgba(103, 103, 105, 0.97)' }}>Dados Pessoais</legend>

                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />

                    <label htmlFor="email">E-mail:</label>
                    <input type="email" id="email" value={email} className={erros.email ? 'input-erro' : ''} onChange={(e) => setEmail(e.target.value)} required />
                    {erros.email && <span className="msg-erro">{erros.email}</span>}
                    
                    <label htmlFor="cpf">CPF:</label>
                    <input type="text" id="cpf" value={cpf} className={erros.cpf ? 'input-erro' : ''} onChange={(e) => setCpf(e.target.value)} required />
                    {erros.cpf && <span className="msg-erro">{erros.cpf}</span>}

                    <label htmlFor="dataNasc">Data nascimento:</label>
                    <input type="date" id="dataNasc" value={dataNasc} className={erros.dataNasc ? 'input-erro' : ''} onChange={(e) => setDataNasc(e.target.value)} required />
                    {erros.dataNasc && <span className="msg-erro">{erros.dataNasc}</span>}

                </fieldset>

                <fieldset className="sessao-form">
                    <legend style={{ color:'rgba(103, 103, 105, 0.97)' }}>Endereço</legend>

                    <label htmlFor="cep">CEP:</label>
                    <input type="text" name="cep" id="cep" value={endereco.cep} className={erros.cep ? 'input-erro' : ''} onChange={handleEnderecoChange} onBlur={buscarCepNaApi} required />
                    {erros.cep && <span className="msg-erro">{erros.cep}</span>}

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

                    
                </fieldset>

                <button type="submit" className="btn btn-finalizar">Salvar Cliente</button>
            </form>
        </div>
    );
}

export default CadastroCliente;