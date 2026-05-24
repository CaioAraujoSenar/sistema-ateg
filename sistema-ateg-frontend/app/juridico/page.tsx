"use client";

import React, { useState, useEffect } from 'react';
import { Home, Briefcase, FileText, Users, Bell, FileSignature, Save, AlertCircle, Database, ClipboardList } from 'lucide-react';

export default function ControleJuridico() {
  // Estados para capturar os dados do formulário contratual
  const [cnpjEmpresa, setCnpjEmpresa] = useState('');
  const [idProfissional, setIdProfissional] = useState('');
  const [numeroContrato, setNumeroContrato] = useState('');
  const [natureza, setNatureza] = useState('');
  const [ordemServico, setOrdemServico] = useState('');
  const [situacao, setSituacao] = useState('');
  const [vigenciaContrato, setVigenciaContrato] = useState('');
  
  // ✨ NOVOS ESTADOS PARA O ADITIVO
  const [numeroAditivo, setNumeroAditivo] = useState('');
  const [inicioAditivo, setInicioAditivo] = useState('');
  const [terminoAditivo, setTerminoAditivo] = useState('');

  // Guardam as listas que vêm do banco de dados
  const [listaEmpresas, setListaEmpresas] = useState([]);
  const [listaProfissionais, setListaProfissionais] = useState([]);

  // Carregar os seletores do banco
  const carregarSeletores = async () => {
    try {
      const resEmp = await fetch('http://localhost:3000/api/empresas');
      if (resEmp.ok) setListaEmpresas(await resEmp.json());

      const resProf = await fetch('http://localhost:3000/api/profissionais');
      if (resProf.ok) setListaProfissionais(await resProf.json());
    } catch (error) {
      console.error("Erro ao carregar listas do formulário:", error);
    }
  };

  useEffect(() => {
    carregarSeletores();
  }, []);

  const handleGravarContrato = async (e) => {
    e.preventDefault();
    
    // 1. Validação dos campos obrigatórios
    if (!cnpjEmpresa || !numeroContrato || !situacao) {
      alert("Por favor, preencha os campos obrigatórios (*): Empresa, Nº do Contrato e Situação.");
      return;
    }

    // 2. Validação Inteligente: Vigência original
    if (situacao === "CONTRATO - CONTRATADO" && !vigenciaContrato) {
      alert("Atenção: Como a situação é 'CONTRATO - CONTRATADO', é obrigatório preencher a data de Vigência do Contrato!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/contratos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cnpj_empresa: cnpjEmpresa,
          id_profissional: idProfissional || null,
          numero_contrato: numeroContrato,
          natureza,
          ordem_servico: ordemServico,
          situacao,
          vigencia_contrato: vigenciaContrato || null, 
          numero_aditivo: numeroAditivo || null,
          inicio_aditivo: inicioAditivo || null,
          termino_aditivo: terminoAditivo || null
        })
      });

      const dados = await response.json();
      if (response.ok) {
        alert("🎉 Contrato/Aditivo gravado com sucesso no sistema!");
        
        // Limpa o formulário completo
        setCnpjEmpresa(''); setIdProfissional(''); setNumeroContrato('');
        setNatureza(''); setOrdemServico(''); setSituacao('');
        setVigenciaContrato(''); setNumeroAditivo(''); 
        setInicioAditivo(''); setTerminoAditivo('');
      } else {
        alert("Erro: " + dados.erro);
      }
    } catch (error) {
      alert("Não foi possível conectar ao servidor backend.");
    }
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
          <a href="/juridico" className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium shadow-md">
            <FileText size={20} /> Controle Jurídico
          </a>
          <a href="/rat" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-lg transition-colors">
            <ClipboardList size={20} /> Formulário RAT
          </a>
          <a href="/bd-empresas" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-lg transition-colors">
            <Database size={20} /> BD_Empresas
          </a>
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-700">Gestão de Contratos e Aditivos</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
              <FileSignature className="text-blue-600" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Vincular Novo Contrato ou Aditivo</h3>
            </div>

            <div className="p-8">
              <form onSubmit={handleGravarContrato} className="space-y-8">
                
                {/* SEÇÃO 1: VINCULAÇÃO */}
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">1. Vinculação das Partes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Empresa Contratada *</label>
                      <select value={cnpjEmpresa} onChange={(e) => setCnpjEmpresa(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
                        <option value="">Selecione a empresa...</option>
                        {listaEmpresas.map((emp) => (
                          <option key={emp.cnpj} value={emp.cnpj}>
                            {emp.razao_social} ({emp.cnpj})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID do Técnico (Matrícula/CPF)</label>
                      <select value={idProfissional} onChange={(e) => setIdProfissional(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
                        <option value="">Selecione o profissional (Opcional)...</option>
                        {listaProfissionais.map((prof) => (
                          <option key={prof.id_tecnico} value={prof.id_tecnico}>
                            {prof.nome} ({prof.id_tecnico})
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>

                {/* SEÇÃO 2: DADOS DO CONTRATO */}
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">2. Informações Contratuais</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nº do Contrato *</label>
                      <input type="text" value={numeroContrato} onChange={(e) => setNumeroContrato(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" placeholder="Ex: 001/2024" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Natureza Jurídica</label>
                      <select value={natureza} onChange={(e) => setNatureza(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
                        <option value="">Selecione...</option>
                        <option value="Pessoa Física">Pessoa Física (Autônomo)</option>
                        <option value="Pessoa Jurídica">Pessoa Jurídica (Empresa)</option>
                        <option value="CLT">CLT (Registro na Carteira)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ordem de Serviço (O.S.)</label>
                      <input type="text" value={ordemServico} onChange={(e) => setOrdemServico(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" placeholder="Ex: OS-2024-001" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Situação Atual *</label>
                      <select 
                        value={situacao} 
                        onChange={(e) => setSituacao(e.target.value)} 
                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-sm ${
                          situacao.includes('INAPTO') || situacao.includes('SUSPENSA') || situacao === 'NÃO CONTRATAR' || situacao === 'DESISTIU'
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : situacao.includes('CONTRATADO') 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'text-gray-700 border-gray-300'
                        }`}
                      >
                        <option value="">Selecione a situação...</option>
                        <option value="RAT - AGENDAR">RAT - AGENDAR</option>
                        <option value="RAT - APTO">RAT - APTO</option>
                        <option value="RAT - INAPTO">RAT - INAPTO</option>
                        <option value="CND - AGUARDANDO EMPRESA">CND - AGUARDANDO EMPRESA</option>
                        <option value="CND - ANÁLISE JURÍDICO">CND - ANÁLISE JURÍDICO</option>
                        <option value="ASSINATURA - EMPRESA">ASSINATURA  - EMPRESA</option>
                        <option value="ASSINATURA - COORDENADOR">ASSINATURA - COORDENADOR</option>
                        <option value="ASSINATURA - DIRETORIA">ASSINATURA - DIRETORIA</option>
                        <option value="OS - ELABORAR">OS - ELABORAR</option>
                        <option value="OS - LIBERAÇÃO GERENCIA">OS - LIBERAÇÃO GERENCIA</option>
                        <option value="OS - ENVIADA PELO ADM">OS - ENVIADA PELO ADM</option>
                        <option value="ORDEM DE SERVIÇO SUSPENSA">ORDEM DE SERVIÇO SUSPENSA</option>
                        <option value="CONTRATO - CONTRATADO">CONTRATO - CONTRATADO</option>
                        <option value="CONTRATO - ENCERRADO">CONTRATO - ENCERRADO</option>
                        <option value="DISTRATO - ELABORAR">DISTRATO - ELABORAR</option>
                        <option value="MEMORANDO - ELABORAR">MEMORANDO - ELABORAR</option>
                        <option value="MEMORANDO ARQUIVADO">MEMORANDO ARQUIVADO</option>
                        <option value="NÃO CONTRATAR">NÃO CONTRATAR</option>
                        <option value="DESISTIU">DESISTIU</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ✨ SEÇÃO 3: PRAZOS E VIGÊNCIAS (ATUALIZADA) */}
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="text-blue-600" size={20} />
                    <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider">3. Prazos e Vigências (Alertas)</h4>
                  </div>
                  
                  {/* CONTRATO ORIGINAL */}
                  <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vigência do Contrato Original {situacao === "CONTRATO - CONTRATADO" ? <span className="text-red-500">*</span> : ""}
                    </label>
                    <input type="date" value={vigenciaContrato} onChange={(e) => setVigenciaContrato(e.target.value)} className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" />
                    <p className="text-xs text-gray-500 mt-2">O sistema disparará alertas vermelhos 60 dias antes deste prazo.</p>
                  </div>

                  {/* ADITIVO CONTRATUAL */}
                  <div className="bg-amber-50/30 p-4 rounded-lg border border-amber-200 shadow-sm">
                    <h5 className="text-sm font-bold text-amber-800 mb-4">Renovação / Aditivo Contratual (Se houver)</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nº do Aditivo</label>
                        <input type="text" value={numeroAditivo} onChange={(e) => setNumeroAditivo(e.target.value)} placeholder="Ex: 001/2025" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-gray-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Início do Aditivo</label>
                        <input type="date" value={inicioAditivo} onChange={(e) => setInicioAditivo(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-gray-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Término do Aditivo</label>
                        <input type="date" value={terminoAditivo} onChange={(e) => setTerminoAditivo(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-gray-700" />
                      </div>
                    </div>
                    <p className="text-xs text-amber-700 mt-3 font-medium">⚠️ Se preenchido, o robô passará a vigiar automaticamente o prazo de término do aditivo para os alertas.</p>
                  </div>

                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button type="submit" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-md">
                    <Save size={20} /> Gravar Contrato no Sistema
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