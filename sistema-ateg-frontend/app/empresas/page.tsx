"use client";

import React, { useState, useEffect } from 'react';
import { Home, Briefcase, FileText, Users, Bell, Building, UserPlus, Save, Database, ClipboardList } from 'lucide-react';

export default function CadastroEmpresas() {
  const [abaAtiva, setAbaAtiva] = useState('empresa');

  // Estados do formulário da Empresa
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [emailEmpresa, setEmailEmpresa] = useState('');

  // Estados do formulário do Técnico
  const [nomeTecnico, setNomeTecnico] = useState('');
  const [tipoProfissional, setTipoProfissional] = useState('');
  const [telefoneTecnico, setTelefoneTecnico] = useState('');
  const [emailTecnico, setEmailTecnico] = useState('');
  
  // ✨ NOVOS ESTADOS: Empresa vinculada e Status do RAT
  const [cnpjVinculado, setCnpjVinculado] = useState('');
  const [precisaRat, setPrecisaRat] = useState('NAO');
  const [listaEmpresas, setListaEmpresas] = useState([]);

  // Busca as empresas para o técnico poder ser vinculado a uma delas
  useEffect(() => {
    const buscarEmpresas = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/empresas');
        if (res.ok) setListaEmpresas(await res.json());
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
      }
    };
    buscarEmpresas();
  }, []);

  // 📝 FUNÇÃO MÁGICA: Formata o CNPJ automaticamente enquanto digita
  const formatarCNPJ = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    return apenasNumeros
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  const handleCnpjChange = (e) => {
    const valorFormatado = formatarCNPJ(e.target.value);
    setCnpj(valorFormatado);
  };

  // Função para enviar os dados da Empresa para o Backend
  const handleSalvarEmpresa = async (e) => {
    e.preventDefault();
    if (!cnpj || !razaoSocial) {
      alert("Por favor, preencha os campos obrigatórios (CNPJ e Razão Social).");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnpj, razao_social: razaoSocial, email_contato: emailEmpresa })
      });

      const dados = await response.json();
      if (response.ok) {
        alert("🎉 Empresa gravada com sucesso no Supabase!");
        setCnpj(''); setRazaoSocial(''); setEmailEmpresa('');
        
        // Atualiza a lista de empresas no formulário do técnico
        const res = await fetch('http://localhost:3000/api/empresas');
        if (res.ok) setListaEmpresas(await res.json());
      } else {
        alert("Erro: " + dados.erro);
      }
    } catch (error) {
      alert("Não foi possível conectar ao servidor backend.");
    }
  };

  // Função para enviar os dados do Técnico para o Backend
  const handleSalvarTecnico = async (e) => {
    e.preventDefault();
    if (!nomeTecnico || !tipoProfissional || !cnpjVinculado) {
      alert("Por favor, preencha os campos obrigatórios (*): Nome, Tipo e Empresa Vinculada.");
      return;
    }

    // ✨ GERA UM ID TEMPORÁRIO AUTOMÁTICO PARA NÃO QUEBRAR O BANCO
    const idGerado = `PENDENTE-${Math.floor(Math.random() * 10000)}`;

    try {
      const response = await fetch('http://localhost:3000/api/profissionais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id_tecnico: idGerado, 
          nome: nomeTecnico, 
          tipo: tipoProfissional, 
          email: emailTecnico, 
          telefone: telefoneTecnico 
        })
      });

      const dados = await response.json();
      if (response.ok) {
        // ✨ REDIRECIONAMENTO INTELIGENTE SE PRECISAR DE RAT
        if (precisaRat === 'SIM') {
          alert("Profissional salvo com sucesso! Redirecionando para agendamento do RAT...");
          window.location.href = `/rat`; // Manda a pessoa direto pra tela do RAT
        } else {
          alert("🎉 Profissional gravado com sucesso no Supabase!");
          setNomeTecnico(''); setTipoProfissional(''); setTelefoneTecnico(''); 
          setEmailTecnico(''); setCnpjVinculado(''); setPrecisaRat('NAO');
        }
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
          <a href="/empresas" className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium shadow-md">
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
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700">Cadastro de Entidades</h2>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* ABAS */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button onClick={() => setAbaAtiva('empresa')} className={`flex-1 py-4 px-6 font-semibold text-sm flex items-center justify-center gap-2 ${abaAtiva === 'empresa' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
                <Building size={18} /> Cadastrar Nova Empresa
              </button>
              <button onClick={() => setAbaAtiva('tecnico')} className={`flex-1 py-4 px-6 font-semibold text-sm flex items-center justify-center gap-2 ${abaAtiva === 'tecnico' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
                <UserPlus size={18} /> Cadastrar Profissional
              </button>
            </div>

            {/* FORMULÁRIO EMPRESA */}
            {abaAtiva === 'empresa' && (
              <form onSubmit={handleSalvarEmpresa} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ *</label>
                    <input 
                      type="text" 
                      value={cnpj} 
                      onChange={handleCnpjChange} 
                      placeholder="00.000.000/0000-00" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Razão Social *</label>
                    <input type="text" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} placeholder="Ex: AgroNorte Serviços Rurais LTDA" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail de Contato</label>
                    <input type="email" value={emailEmpresa} onChange={(e) => setEmailEmpresa(e.target.value)} placeholder="contato@empresa.com.br" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm">
                    <Save size={18} /> Salvar Empresa
                  </button>
                </div>
              </form>
            )}

            {/* FORMULÁRIO TÉCNICO */}
            {abaAtiva === 'tecnico' && (
              <form onSubmit={handleSalvarTecnico} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                    <input type="text" value={nomeTecnico} onChange={(e) => setNomeTecnico(e.target.value)} placeholder="Nome do profissional" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Profissional *</label>
                    <select value={tipoProfissional} onChange={(e) => setTipoProfissional(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">Selecione...</option>
                      <option value="TECNICO">Técnico de Campo</option>
                      <option value="SUPERVISOR">Supervisor</option>
                    </select>
                  </div>

                  {/* ✨ NOVO CAMPO: VINCULAR EMPRESA */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Empresa Vinculada *</label>
                    <select value={cnpjVinculado} onChange={(e) => setCnpjVinculado(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">Selecione a empresa...</option>
                      {listaEmpresas.map((emp) => (
                        <option key={emp.cnpj} value={emp.cnpj}>
                          {emp.razao_social}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone / WhatsApp</label>
                    <input type="text" value={telefoneTecnico} onChange={(e) => setTelefoneTecnico(e.target.value)} placeholder="(00) 00000-0000" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {/* ✨ NOVO CAMPO: STATUS RAT E REDIRECIONAMENTO */}
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mt-4">
                  <label className="block text-sm font-bold text-blue-800 mb-2">Situação de Avaliação (RAT)</label>
                  <select value={precisaRat} onChange={(e) => setPrecisaRat(e.target.value)} className="w-full px-4 py-2 border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
                    <option value="NAO">Já realizou o RAT / Dispensado</option>
                    <option value="SIM">RAT - ENVIAR (Agendar Reunião)</option>
                  </select>
                  <p className="text-xs text-blue-600 mt-2">
                    {precisaRat === 'SIM' ? "⚠️ O sistema irá redirecioná-lo automaticamente para a tela de agendamento após salvar." : "Nenhum agendamento pendente."}
                  </p>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button type="submit" className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm">
                    <Save size={18} /> Salvar Profissional
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}