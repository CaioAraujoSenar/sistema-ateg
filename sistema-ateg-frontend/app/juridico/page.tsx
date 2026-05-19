"use client";

import React, { useState } from 'react';
import { Home, Briefcase, FileText, Users, Bell, FileSignature, Save, AlertCircle } from 'lucide-react';

export default function ControleJuridico() {
  // Estados para capturar os dados do formulário contratual
  const [cnpjEmpresa, setCnpjEmpresa] = useState('');
  const [idProfissional, setIdProfissional] = useState('');
  const [numeroContrato, setNumeroContrato] = useState('');
  const [natureza, setNatureza] = useState('');
  const [ordemServico, setOrdemServico] = useState(''); // ✨ Novo campo adicionado!
  const [situacao, setSituacao] = useState('');
  const [vigenciaContrato, setVigenciaContrato] = useState('');
  const [vigenciaAditivo, setVigenciaAditivo] = useState('');

  // Função para enviar o contrato para o Backend
 // Função para enviar o contrato para o Backend
  const handleGravarContrato = async (e) => {
    e.preventDefault();
    
    // 1. Validação dos campos que são SEMPRE obrigatórios
    if (!cnpjEmpresa || !idProfissional || !numeroContrato || !situacao) {
      alert("Por favor, preencha os campos obrigatórios (*): Empresa, Profissional, Nº do Contrato e Situação.");
      return;
    }

    // 2. ✨ VALIDAÇÃO INTELIGENTE: Vigência só é obrigatória se estiver CONTRATADO
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
          id_profissional: idProfissional,
          numero_contrato: numeroContrato,
          natureza,
          ordem_servico: ordemServico,
          situacao,
          vigencia_contrato: vigenciaContrato || null, // Se não tiver, envia nulo para o banco
          vigencia_aditivo: vigenciaAditivo || null
        })
      });

      const dados = await response.json();
      if (response.ok) {
        alert("🎉 Contrato e Ordem de Serviço gravados com sucesso no Supabase!");
        // Limpa o formulário
        setCnpjEmpresa(''); setIdProfissional(''); setNumeroContrato('');
        setNatureza(''); setOrdemServico(''); setSituacao('');
        setVigenciaContrato(''); setVigenciaAditivo('');
      } else {
        alert("Erro: " + dados.erro);
      }
    } catch (error) {
      alert("Não foi possível conectar ao servidor backend.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* MENU LATERAL */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
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
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700">Gestão de Contratos e Aditivos</h2>
        </header>

        {/* CONTEÚDO DA TELA */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
              <FileSignature className="text-blue-600" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Vincular Novo Contrato</h3>
            </div>

            <div className="p-8">
              <form onSubmit={handleGravarContrato} className="space-y-8">
                
                {/* SEÇÃO 1: VINCULAÇÃO */}
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">1. Vinculação das Partes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Empresa Contratada *</label>
                      <select value={cnpjEmpresa} onChange={(e) => setCnpjEmpresa(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="">Selecione a empresa...</option>
                        {/* Valores temporários para o teste da madrugada */}
                        <option value="12.345.678/0001-99">Sena Soluções Agrícolas (12.345.678/0001-99)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profissional de Campo *</label>
                      <select value={idProfissional} onChange={(e) => setIdProfissional(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="">Selecione o profissional...</option>
                        <option value="TEC456">Victor Silva (TEC456)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SEÇÃO 2: DADOS DO CONTRATO */}
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
                        
                        {/* FLUXO RAT / EXAMES */}
                        <option value="RAT - AGENDAR">RAT - AGENDAR</option>
                        <option value="RAT - APTO">RAT - APTO</option>
                        <option value="RAT - INAPTO">RAT - INAPTO</option>
                        
                        {/* FLUXO CERTIDÕES / CND */}
                        <option value="CND - AGUARDANDO EMPRESA">CND - AGUARDANDO EMPRESA</option>
                        <option value="CND - ANÁLISE JURÍDICO">CND - ANÁLISE JURÍDICO</option>
                        
                        {/* FLUXO ASSINATURAS */}
                        <option value="ASSINATURA - EMPRESA">ASSINATURA  - EMPRESA</option>
                        <option value="ASSINATURA - COORDENADOR">ASSINATURA - COORDENADOR</option>
                        <option value="ASSINATURA - DIRETORIA">ASSINATURA - DIRETORIA</option>
                        
                        {/* FLUXO ORDEM DE SERVIÇO */}
                        <option value="OS - ELABORAR">OS - ELABORAR</option>
                        <option value="OS - LIBERAÇÃO GERENCIA">OS - LIBERAÇÃO GERENCIA</option>
                        <option value="OS - ENVIADA PELO ADM">OS - ENVIADA PELO ADM</option>
                        <option value="ORDEM DE SERVIÇO SUSPENSA">ORDEM DE SERVIÇO SUSPENSA</option>
                        
                        {/* FLUXO CONTRATUAL / FINALIZAÇÕES */}
                        <option value="CONTRATO - CONTRATADO">CONTRATO - CONTRATADO</option>
                        <option value="CONTRATO - ENCERRADO">CONTRATO - ENCERRADO</option>
                        <option value="DISTRATO - ELABORAR">DISTRATO - ELABORAR</option>
                        
                        {/* FLUXO MEMORANDOS */}
                        <option value="MEMORANDO - ELABORAR">MEMORANDO - ELABORAR</option>
                        <option value="MEMORANDO ARQUIVADO">MEMORANDO ARQUIVADO</option>
                        
                        {/* EXCEÇÕES */}
                        <option value="NÃO CONTRATAR">NÃO CONTRATAR</option>
                        <option value="DESISTIU">DESISTIU</option>
                      </select>
                    </div>

                {/* SEÇÃO 3: PRAZOS E VIGÊNCIAS */}
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="text-blue-600" size={20} />
                    <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider">3. Prazos e Vigências (Alertas)</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      {/* ✨ Label dinâmica com asterisco condicional */}
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vigência do Contrato {situacao === "CONTRATO - CONTRATADO" ? <span className="text-red-500">*</span> : ""}
                      </label>
                      <input type="date" value={vigenciaContrato} onChange={(e) => setVigenciaContrato(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" />
                      <p className="text-xs text-gray-500 mt-2">O sistema disparará alertas vermelhos 60 dias antes deste prazo.</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vigência do Aditivo</label>
                      <input type="date" value={vigenciaAditivo} onChange={(e) => setVigenciaAditivo(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" />
                      <p className="text-xs text-gray-500 mt-2">Preencha apenas caso haja prorrogação por termo aditivo.</p>
                    </div>
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