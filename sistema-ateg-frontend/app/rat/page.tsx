"use client";

import React, { useState, useEffect } from 'react';
import { Home, Briefcase, FileText, Database, ClipboardList, Save, Calendar, CheckSquare, Send, Mail } from 'lucide-react';

export default function FormularioRAT() {
  // Estados para os campos do formulário RAT
  const [status, setStatus] = useState('');
  const [dataSolicitacaoGerente, setDataSolicitacaoGerente] = useState('');
  const [local, setLocal] = useState('presencial');
  const [dataRat, setDataRat] = useState('');
  const [horario, setHorario] = useState('');
  const [natureza, setNatureza] = useState('');
  const [idTecnico, setIdTecnico] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [emailEmpresa, setEmailEmpresa] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [cadeiaProdutiva, setCadeiaProdutiva] = useState('');
  const [gerente, setGerente] = useState('');
  const [emailGerente, setEmailGerente] = useState('');
  const [observacao, setObservacao] = useState('');
  const [avaliacao, setAvaliacao] = useState('');

  // Listas dinâmicas vindas do banco
  const [listaEmpresas, setListaEmpresas] = useState([]);
  const [listaProfissionais, setListaProfissionais] = useState([]);

  // Carrega as empresas e técnicos cadastrados
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resEmp = await fetch('http://localhost:3000/api/empresas');
        if (resEmp.ok) setListaEmpresas(await resEmp.json());

        const resProf = await fetch('http://localhost:3000/api/profissionais');
        if (resProf.ok) setListaProfissionais(await resProf.json());
      } catch (error) {
        console.error("Erro ao carregar seletores:", error);
      }
    };
    carregarDados();
  }, []);

  const handleEmpresaChange = (cnpjSelecionado) => {
    const empresa = listaEmpresas.find(e => e.cnpj === cnpjSelecionado);
    if (empresa) {
      setCnpj(empresa.cnpj);
      setEmailEmpresa(empresa.email_contato || '');
    } else {
      setCnpj('');
      setEmailEmpresa('');
    }
  };

  const handleTecnicoChange = (idSelecionado) => {
    setIdTecnico(idSelecionado);
    const prof = listaProfissionais.find(p => p.id_tecnico === idSelecionado);
    if (prof) {
      setNatureza(prof.tipo || '');
    } else {
      setNatureza('');
    }
  };

  // ✨ FUNÇÃO BASE DE GRAVAÇÃO (USADA PELOS 3 BOTÕES)
  const gravarNoBanco = async () => {
    if (!status || !dataSolicitacaoGerente || !cnpj) {
      alert("Por favor, preencha os campos obrigatórios (*): Status, Data de Solicitação e Empresa.");
      return false;
    }

    try {
      const response = await fetch('http://localhost:3000/api/rat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status, data_solicitacao_gerente: dataSolicitacaoGerente, local,
          data_rat: dataRat || null, horario: horario || null, natureza,
          id_tecnico: idTecnico || null, cnpj_empresa: cnpj, email_empresa: emailEmpresa,
          municipio, cadeia_produtiva: cadeiaProdutiva, gerente, email_gerente: emailGerente,
          observacao, avaliacao
        })
      });

      if (response.ok) {
        return true;
      } else {
        const dados = await response.json();
        alert("Erro ao gravar: " + dados.erro);
        return false;
      }
    } catch (error) {
      alert("Não foi possível conectar ao servidor backend.");
      return false;
    }
  };

  // ✨ BOTÃO 1: SALVAR APENAS
  const handleApenasSalvar = async (e) => {
    e.preventDefault();
    const sucesso = await gravarNoBanco();
    if (sucesso) {
      alert("🎉 Registro de RAT gravado com sucesso!");
      limparFormulario();
    }
  };

  // ✨ BOTÃO 2: ENVIAR CONVITE DE AGENDAMENTO
  const handleEnviarConvite = async (e) => {
    e.preventDefault();
    const sucesso = await gravarNoBanco();
    if (!sucesso) return;

    if (!emailGerente) {
      alert("Para enviar o e-mail, é necessário preencher o E-mail do Gerente.");
      return;
    }

    const nomeProf = listaProfissionais.find(p => p.id_tecnico === idTecnico)?.nome || "Profissional não selecionado";
    const nomeEmpresa = listaEmpresas.find(e => e.cnpj === cnpj)?.razao_social || "Empresa não selecionada";

    const assunto = encodeURIComponent(`AGENDAMENTO RAT - ${nomeProf} - ${municipio}`);
    const corpo = encodeURIComponent(`Olá, ${gerente},

Sua Reunião de Alinhamento Técnico (RAT) foi agendada.

📋 DADOS DO AGENDAMENTO:
Data da Reunião: ${dataRat || 'A definir'}
Horário: ${horario || 'A definir'}
Modalidade: ${local.toUpperCase()}

👨‍🌾 DADOS TÉCNICOS:
Profissional: ${nomeProf}
Perfil: ${natureza}
Empresa Solicitante: ${nomeEmpresa}
CNPJ: ${cnpj}

📍 LOCALIDADE:
Município: ${municipio}
Cadeia Produtiva: ${cadeiaProdutiva}

Observações Adicionais: ${observacao || 'Nenhuma observação.'}

Atenciosamente,
Equipe Administrativa - SENAR ATeG`);

    window.location.href = `mailto:${emailGerente}?subject=${assunto}&body=${corpo}`;
    limparFormulario();
  };

  // ✨ BOTÃO 3: ENVIAR RESULTADO PÓS-RAT
  const handleEnviarResultado = async (e) => {
    e.preventDefault();
    const sucesso = await gravarNoBanco();
    if (!sucesso) return;

    if (!emailGerente || !avaliacao) {
      alert("Para enviar o resultado, preencha o E-mail do Gerente e o Resultado da Avaliação (Bloco 5).");
      return;
    }

    const nomeProf = listaProfissionais.find(p => p.id_tecnico === idTecnico)?.nome || "Profissional não selecionado";

    const assunto = encodeURIComponent(`RESULTADO RAT - ${nomeProf} - ${avaliacao}`);
    const corpo = encodeURIComponent(`Olá, ${gerente},

Informamos o resultado da Reunião de Avaliação Técnica (RAT) realizada.

📌 RESULTADO OFICIAL: ${avaliacao}

👨‍🌾 PROFISSIONAL AVALIADO:
Nome: ${nomeProf}
Perfil: ${natureza}
Município: ${municipio}
Cadeia Produtiva: ${cadeiaProdutiva}

📝 PARECER / OBSERVAÇÕES DA AVALIAÇÃO:
${observacao || 'Nenhuma observação registrada.'}

Atenciosamente,
Equipe Administrativa - SENAR ATeG`);

    window.location.href = `mailto:${emailGerente}?subject=${assunto}&body=${corpo}`;
    limparFormulario();
  };

  const limparFormulario = () => {
    setStatus(''); setDataSolicitacaoGerente(''); setLocal('presencial');
    setDataRat(''); setHorario(''); setNatureza(''); setIdTecnico('');
    setCnpj(''); setEmailEmpresa(''); setMunicipio(''); setCadeiaProdutiva('');
    setGerente(''); setEmailGerente(''); setObservacao(''); setAvaliacao('');
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* MENU LATERAL */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 h-full">
        <div className="p-6 text-center border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">ATeG SIS</h1>
          <p className="text-xs text-slate-400 mt-1">Gestão de Contratos</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="/" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-lg transition-colors">
            <Home size={20} /> Dashboard Geral
          </a>
          <a href="/empresas" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-lg transition-colors">
            <Briefcase size={20} /> Empresas e Técnicos
          </a>
          <a href="/rat" className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium shadow-md">
            <ClipboardList size={20} /> Formulário RAT
          </a>
          <a href="/juridico" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-lg transition-colors">
            <FileText size={20} /> Controle Jurídico
          </a>
          <a href="/bd-empresas" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-lg transition-colors">
            <Database size={20} /> BD_Empresas
          </a>
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-700">Entrada de Demandas Técnicas (RAT)</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
              <Calendar className="text-blue-600" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Novo Registro de RAT</h3>
            </div>

            <div className="p-8">
              <form className="space-y-8">
                
                {/* BLOCO 1: STATUS E CONTROLE DE TEMPO */}
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">1. Controle de Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status RAT *</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium">
                        <option value="">Selecione...</option>
                        <option value="AGENDADO">AGENDADO</option>
                        <option value="CONCLUÍDO">CONCLUÍDO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Solicitação do Gerente *</label>
                      <input type="date" value={dataSolicitacaoGerente} onChange={(e) => setDataSolicitacaoGerente(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Modalidade do Local</label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                          <input type="radio" name="local" value="presencial" checked={local === 'presencial'} onChange={() => setLocal('presencial')} className="text-blue-600 focus:ring-blue-500" /> Presencial
                        </label>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                          <input type="radio" name="local" value="online" checked={local === 'online'} onChange={() => setLocal('online')} className="text-blue-600 focus:ring-blue-500" /> Online
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data Realização do RAT</label>
                      <input type="date" value={dataRat} onChange={(e) => setDataRat(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
                      <input type="time" value={horario} onChange={(e) => setHorario(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm" />
                    </div>
                  </div>
                </div>

                {/* BLOCO 2: VINCULAÇÃO TÉCNICA */}
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">2. Dados Técnicos e Estrutura Jurídica</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Técnico Vinculado</label>
                      <select value={idTecnico} onChange={(e) => handleTecnicoChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm">
                        <option value="">Selecione o profissional...</option>
                        {listaProfissionais.map(p => (
                          <option key={p.id_tecnico} value={p.id_tecnico}>{p.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Natureza</label>
                      <input type="text" value={natureza} readOnly placeholder="Preenchido via técnico..." className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Empresa Solicitante *</label>
                      <select value={cnpj} onChange={(e) => handleEmpresaChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm">
                        <option value="">Selecione...</option>
                        {listaEmpresas.map(e => (
                          <option key={e.cnpj} value={e.cnpj}>{e.razao_social}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ da Empresa</label>
                      <input type="text" value={cnpj} readOnly placeholder="Preenchido automaticamente" className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 text-sm font-mono outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-mail da Empresa</label>
                      <input type="text" value={emailEmpresa} readOnly placeholder="Preenchido automaticamente" className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 text-sm outline-none" />
                    </div>
                  </div>
                </div>

                {/* BLOCO 3: ALOCAÇÃO REGIONAL E SUPERVISÃO */}
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">3. Localidade, Cadeia e Supervisão</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Município de Atuação</label>
                      <input type="text" value={municipio} onChange={(e) => setMunicipio(e.target.value)} placeholder="Ex: Castanhal" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cadeia Produtiva</label>
                      <input type="text" value={cadeiaProdutiva} onChange={(e) => setCadeiaProdutiva(e.target.value)} placeholder="Ex: Olericultura / Cacauicultura" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gerente Responsável</label>
                      <input type="text" value={gerente} onChange={(e) => setGerente(e.target.value)} placeholder="Nome do gerente regional" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-mail do Gerente</label>
                      <input type="email" value={emailGerente} onChange={(e) => setEmailGerente(e.target.value)} placeholder="gerente@institucional.org.br" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm" />
                    </div>
                  </div>
                </div>

                {/* BLOCO 4: OBSERVAÇÃO */}
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">4. Informações Adicionais</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Observações Gerais</label>
                    <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} rows={3} placeholder="Digite detalhes da reunião, pendências de documentos ou motivos de remarcação..." className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                </div>

                {/* BLOCO 5: AVALIAÇÃO (PÓS-RAT) */}
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckSquare className="text-blue-600" size={20} />
                    <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider">5. Avaliação (Uso Pós-RAT)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Resultado da Avaliação</label>
                      <select value={avaliacao} onChange={(e) => setAvaliacao(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm">
                        <option value="">Selecione o resultado...</option>
                        <option value="AGENDADO">AGENDADO</option>
                        <option value="REMARCAR">REMARCAR</option>
                        <option value="APTO">APTO</option>
                        <option value="INAPTO">INAPTO</option>
                        <option value="PARCIALMENTE APTO">PARCIALMENTE APTO</option>
                        <option value="NÃO COMPARECIMENTO À REUNIÃO">NÃO COMPARECIMENTO À REUNIÃO</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ✨ BARRA DE AÇÕES (3 BOTÕES) */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t mt-8">
                  <button onClick={handleApenasSalvar} type="button" className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-bold transition-colors text-sm">
                    <Save size={18} /> Apenas Salvar
                  </button>
                  
                  <button onClick={handleEnviarConvite} type="button" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-md text-sm">
                    <Calendar size={18} /> Salvar & Enviar Convite
                  </button>

                  <button onClick={handleEnviarResultado} type="button" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-md text-sm">
                    <Send size={18} /> Salvar & Enviar Resultado
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}