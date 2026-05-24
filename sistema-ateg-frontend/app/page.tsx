"use client";

import React, { useState, useEffect } from 'react';
import { Home, Briefcase, FileText, RefreshCw, Search, Users, ShieldAlert, CheckCircle, FileCheck, Database, ClipboardList } from 'lucide-react';

export default function DashboardGeral() {
  const [contratos, setContratos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  // Busca as informações unificadas do Backend
  const buscarDados = async () => {
    setCarregando(true);
    try {
      const response = await fetch('http://localhost:3000/api/dashboard-contratos');
      if (response.ok) {
        const dados = await response.json();
        setContratos(dados);
      }
    } catch (error) {
      console.error("Erro ao conectar com o backend:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  // Filtro de busca para a equipe administrativa
  const contratosFiltrados = contratos.filter(item => 
    (item.nome_tecnico?.toLowerCase().includes(busca.toLowerCase())) ||
    (item.razao_social?.toLowerCase().includes(busca.toLowerCase())) ||
    (item.numero_contrato?.toLowerCase().includes(busca.toLowerCase()))
  );

  // 📊 CÁLCULO DINÂMICO DOS KPI's COM BASE NAS 19 OPÇÕES DO FLUXO
  const totalProcessos = contratos.length;
  
  const totalContratados = contratos.filter(c => c.situacao === 'CONTRATO - CONTRATADO').length;
  
  const emAnaliseOuAssinatura = contratos.filter(c => 
    c.situacao?.includes('ANÁLISE') || c.situacao?.includes('ASSINATURA') || c.situacao?.includes('AGUARDANDO')
  ).length;

  const criticosOuSuspensos = contratos.filter(c => 
    c.situacao?.includes('INAPTO') || c.situacao?.includes('SUSPENSA') || c.situacao === 'NÃO CONTRATAR' || c.situacao === 'DESISTIU'
  ).length;

  // Estilização inteligente de cores por Situação
  const obterEstiloSituacao = (sit) => {
    if (!sit) return 'bg-gray-100 text-gray-800';
    if (sit.includes('INAPTO') || sit.includes('SUSPENSA') || sit === 'NÃO CONTRATAR' || sit === 'DESISTIU') {
      return 'bg-red-50 text-red-700 border border-red-200';
    }
    if (sit.includes('CONTRATADO')) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
    if (sit.includes('ASSINATURA') || sit.includes('OS -')) {
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    }
    return 'bg-amber-50 text-amber-700 border border-amber-200'; // Fluxos iniciais (RAT/CND)
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-800 overflow-hidden">
      
      {/* MENU LATERAL FIXO */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 h-full">
        <div className="p-6 text-center border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">ATeG SIS</h1>
          <p className="text-xs text-slate-400 mt-1">Gestão de Contratos</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="/" className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium shadow-md">
            <Home size={20} /> Dashboard Geral
          </a>
          <a href="/empresas" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-lg transition-colors">
            <Briefcase size={20} /> Empresas e Técnicos
          </a>
          <a href="/juridico" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-lg transition-colors">
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
          <h2 className="text-xl font-semibold text-gray-700">Acompanhamento Administrativo Geral</h2>
          <button onClick={buscarDados} className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors border">
            <RefreshCw size={16} /> Atualizar Painel
          </button>
        </header>

        {/* CONTEÚDO PRINCIPAL COM SCROLL */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* 📊 SEÇÃO DE BLOCOS DE KPI (VOLTOU!) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total de Processos</p>
                <h3 className="text-2xl font-black text-gray-800 mt-1">{totalProcessos}</h3>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                <Users size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Contratados (Ativos)</p>
                <h3 className="text-2xl font-black text-emerald-700 mt-1">{totalContratados}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Tramitação / Assinatura</p>
                <h3 className="text-2xl font-black text-blue-700 mt-1">{emAnaliseOuAssinatura}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <FileCheck size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Críticos / Suspensos</p>
                <h3 className="text-2xl font-black text-red-700 mt-1">{criticosOuSuspensos}</h3>
              </div>
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <ShieldAlert size={24} />
              </div>
            </div>
          </div>

          {/* BARRA DE PESQUISA */}
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border shadow-sm max-w-md">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Filtrar por técnico, empresa ou contrato..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full outline-none text-sm text-gray-700"
            />
          </div>

          {/* TABELA COM AS 7 COLUNAS SOLICITADAS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-700">Fila de Processos Administrativos</h3>
              <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-full border border-blue-100">
                {contratosFiltrados.length} Registros
              </span>
            </div>

            <div className="overflow-x-auto">
              {carregando ? (
                <div className="p-12 text-center text-gray-400 text-sm">Carregando dados da API...</div>
              ) : contratosFiltrados.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-sm">Nenhum processo administrativo encontrado.</div>
              ) : (
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 w-[240px]">SITUAÇÃO</th>
                      <th className="p-4">NATUREZA</th>
                      <th className="p-4">TECNICO</th>
                      <th className="p-4">EMPRESA</th>
                      <th className="p-4">CNPJ</th>
                      <th className="p-4">CONTRATO</th>
                      <th className="p-4">E-MAIL</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100 bg-white">
                    {contratosFiltrados.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                        {/* 1. SITUAÇÃO */}
                        <td className="p-4 font-medium">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold block text-center truncate ${obterEstiloSituacao(item.situacao)}`}>
                            {item.situacao}
                          </span>
                        </td>
                        {/* 2. NATUREZA */}
                        <td className="p-4 text-gray-700 font-medium">{item.natureza || '-'}</td>
                        {/* 3. TECNICO */}
                        <td className="p-4 font-semibold text-gray-900">{item.nome_tecnico}</td>
                        {/* 4. EMPRESA */}
                        <td className="p-4 text-gray-700">{item.razao_social}</td>
                        {/* 5. CNPJ */}
                        <td className="p-4 text-xs text-gray-500 font-mono whitespace-nowrap">{item.cnpj_empresa}</td>
                        {/* 6. CONTRATO */}
                        <td className="p-4 font-bold text-blue-600 whitespace-nowrap">{item.numero_contrato}</td>
                        {/* 7. E-MAIL */}
                        <td className="p-4 text-gray-500 text-xs">{item.email_tecnico || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}