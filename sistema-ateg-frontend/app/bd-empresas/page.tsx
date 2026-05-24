"use client";

import React, { useState, useEffect } from 'react';
import { Home, Database, X, Pencil, Save, RotateCcw } from 'lucide-react';

export default function BDEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

  const [modoEdicao, setModoEdicao] = useState(false);
  const [camposEditaveis, setCamposEditaveis] = useState({
    razao_social: '',
    email_empresa: '',
    nome_tecnico: '',
    rat_status: '',
    juridico_situacao: '',
    juridico_contrato: '',
    vigencia_contrato: '',
    termino_aditivo: '',
  });

  useEffect(() => {
    const buscarHistorico = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/historico-empresas');
        if (response.ok) setEmpresas(await response.json());
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setCarregando(false);
      }
    };
    buscarHistorico();
  }, []);

  const iniciarEdicao = (emp) => {
    setCamposEditaveis({
      razao_social: emp.razao_social || '',
      email_empresa: emp.email_empresa || '',
      nome_tecnico: emp.nome_tecnico || '',
      rat_status: emp.rat_status || '',
      juridico_situacao: emp.juridico_situacao || '',
      juridico_contrato: emp.juridico_contrato || '',
      vigencia_contrato: emp.vigencia_contrato ? emp.vigencia_contrato.substring(0, 10) : '',
      termino_aditivo: emp.termino_aditivo ? emp.termino_aditivo.substring(0, 10) : '',
    });
    setModoEdicao(true);
  };

  const cancelarEdicao = () => {
    setModoEdicao(false);
  };

  const salvarEdicao = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/empresas/${empresaSelecionada.cnpj}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(camposEditaveis),
      });
      if (res.ok) {
        alert("Alterações salvas com sucesso!");
        setModoEdicao(false);
        window.location.reload();
      } else {
        alert("Erro ao salvar. Tente novamente.");
      }
    } catch (err) {
      alert("Erro ao salvar.");
    }
  };

  const handleCampo = (campo, valor) => {
    setCamposEditaveis(prev => ({ ...prev, [campo]: valor }));
  };

  const formatarData = (d) =>
    !d ? '-' : new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

  const empresasFiltradas = empresas.filter(item =>
    item.razao_social?.toLowerCase().includes(busca.toLowerCase()) ||
    item.cnpj?.includes(busca) ||
    item.nome_tecnico?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-800 overflow-hidden relative">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 h-full">
        <div className="p-6 text-center border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">ATeG SIS</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="/" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-lg">
            <Home size={20} /> Dashboard Geral
          </a>
          <a href="/bd-empresas" className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium">
            <Database size={20} /> BD_Empresas
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700">Banco de Dados (Raio-X das Empresas)</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Barra de busca */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por razão social, CNPJ ou técnico..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {carregando ? (
              <p className="p-8 text-center text-gray-400 text-sm">Carregando...</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
                    <th className="p-4">STATUS JURÍDICO</th>
                    <th className="p-4">RAZÃO SOCIAL</th>
                    <th className="p-4">AÇÃO</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y">
                  {empresasFiltradas.map((emp, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">{emp.juridico_situacao || 'Aguardando'}</td>
                      <td className="p-4 font-bold">{emp.razao_social}</td>
                      <td className="p-4">
                        <button
                          onClick={() => { setEmpresaSelecionada(emp); setModoEdicao(false); }}
                          className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-slate-700 transition-colors"
                        >
                          Ver Histórico
                        </button>
                      </td>
                    </tr>
                  ))}
                  {empresasFiltradas.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-400 text-sm">Nenhuma empresa encontrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Painel lateral */}
      {empresaSelecionada && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) { setEmpresaSelecionada(null); setModoEdicao(false); } }}
        >
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">

            {/* Cabeçalho do painel */}
            <div className="p-5 border-b bg-slate-900 text-white flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base truncate">
                  {modoEdicao ? camposEditaveis.razao_social || 'Editando...' : empresaSelecionada.razao_social}
                </h3>
                <p className="text-slate-400 text-xs mt-1 truncate">
                  ✉️ {modoEdicao
                    ? (camposEditaveis.email_empresa || 'Sem e-mail')
                    : (empresaSelecionada.email_empresa || 'Sem e-mail')}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {modoEdicao ? (
                  <>
                    <button
                      onClick={salvarEdicao}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Save size={13} /> Salvar
                    </button>
                    <button
                      onClick={cancelarEdicao}
                      className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <RotateCcw size={13} /> Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => iniciarEdicao(empresaSelecionada)}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Pencil size={13} /> Editar
                  </button>
                )}
                <button
                  onClick={() => { setEmpresaSelecionada(null); setModoEdicao(false); }}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Banner modo edição */}
            {modoEdicao && (
              <div className="bg-amber-50 border-b-2 border-amber-400 px-5 py-2 text-amber-800 text-xs font-semibold flex items-center gap-2">
                ✏️ Modo edição ativo — altere os campos e clique em Salvar
              </div>
            )}

            {/* Corpo do painel */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50">

              {/* Dados da Empresa */}
              <Section title="Dados da Empresa">
                <Field label="Razão Social">
                  {modoEdicao
                    ? <Input value={camposEditaveis.razao_social} onChange={v => handleCampo('razao_social', v)} />
                    : <Value bold>{empresaSelecionada.razao_social || '-'}</Value>}
                </Field>
                <Field label="E-mail">
                  {modoEdicao
                    ? <Input value={camposEditaveis.email_empresa} onChange={v => handleCampo('email_empresa', v)} type="email" />
                    : <Value>{empresaSelecionada.email_empresa || '-'}</Value>}
                </Field>
                <Field label="CNPJ" readonly>
                  <Value>{empresaSelecionada.cnpj || '-'}</Value>
                </Field>
              </Section>

              {/* Profissional Vinculado */}
              <Section title="Profissional Vinculado">
                <Field label="Nome Técnico">
                  {modoEdicao
                    ? <Input value={camposEditaveis.nome_tecnico} onChange={v => handleCampo('nome_tecnico', v)} />
                    : <Value>{empresaSelecionada.nome_tecnico || 'Não vinculado'}</Value>}
                </Field>
              </Section>

              {/* Fase 1: RAT */}
              <Section title="Fase 1: RAT">
                <Field label="Status">
                  {modoEdicao
                    ? <Input value={camposEditaveis.rat_status} onChange={v => handleCampo('rat_status', v)} />
                    : <Value>{empresaSelecionada.rat_status || 'Pendente'}</Value>}
                </Field>
              </Section>

              {/* Fase 2: Jurídico */}
              <Section title="Fase 2: Jurídico">
                <Field label="Situação Jurídica">
                  {modoEdicao
                    ? <Input value={camposEditaveis.juridico_situacao} onChange={v => handleCampo('juridico_situacao', v)} />
                    : <Value>{empresaSelecionada.juridico_situacao || '-'}</Value>}
                </Field>
                <Field label="Contrato">
                  {modoEdicao
                    ? <Input value={camposEditaveis.juridico_contrato} onChange={v => handleCampo('juridico_contrato', v)} />
                    : <Value>{empresaSelecionada.juridico_contrato || '-'}</Value>}
                </Field>
                <Field label="Vigência Original">
                  {modoEdicao
                    ? <Input value={camposEditaveis.vigencia_contrato} onChange={v => handleCampo('vigencia_contrato', v)} type="date" />
                    : <Value>{formatarData(empresaSelecionada.vigencia_contrato)}</Value>}
                </Field>
                <Field label="Término do Aditivo">
                  {modoEdicao
                    ? <Input value={camposEditaveis.termino_aditivo} onChange={v => handleCampo('termino_aditivo', v)} type="date" />
                    : <Value highlight={!!empresaSelecionada.termino_aditivo}>{formatarData(empresaSelecionada.termino_aditivo)}</Value>}
                </Field>
              </Section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Componentes auxiliares ── */

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-gray-100">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</span>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, readonly, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
        {label}
        {readonly && <span className="normal-case text-[9px] italic text-slate-300">(somente leitura)</span>}
      </span>
      {children}
    </div>
  );
}

function Value({ children, bold, highlight }) {
  return (
    <span className={`text-sm ${bold ? 'font-semibold text-slate-800' : 'text-slate-600'} ${highlight ? 'font-bold text-amber-600' : ''}`}>
      {children}
    </span>
  );
}

function Input({ value, onChange, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border-2 border-blue-400 bg-blue-50 rounded-lg px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all w-full"
    />
  );
}
