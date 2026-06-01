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
      rat_status: emp.rat_status || '',
      juridico_situacao: emp.juridico_situacao || '',
      juridico_contrato: emp.juridico_contrato || '',
      vigencia_contrato: emp.vigencia_contrato ? emp.vigencia_contrato.substring(0, 10) : '',
      termino_aditivo: emp.termino_aditivo ? emp.termino_aditivo.substring(0, 10) : '',
    });
    setModoEdicao(true);
  };

  const salvarEdicao = async () => {
    // 1. Verificação de segurança: se não tem empresa selecionada, aborta
    if (!empresaSelecionada) {
      alert("Erro: Nenhuma empresa selecionada para salvar.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/empresas/${empresaSelecionada.cnpj}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(camposEditaveis),
      });

      if (res.ok) {
        alert("Alterações salvas com sucesso!");
        setModoEdicao(false);
        setEmpresaSelecionada(null); // Fecha o painel
        window.location.reload();    // Recarrega os dados
      } else {
        const errorData = await res.json();
        alert("Erro no servidor: " + (errorData.erro || "Falha ao salvar"));
      }
    } catch (err) {
      alert("Erro de conexão com o servidor.");
      console.error(err);
    }
  };

  const handleCampo = (campo, valor) => setCamposEditaveis(prev => ({ ...prev, [campo]: valor }));

  const formatarData = (d) => !d ? '-' : new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

  const empresasFiltradas = empresas.filter(item =>
    item.razao_social?.toLowerCase().includes(busca.toLowerCase()) ||
    item.cnpj?.includes(busca)
  );

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-800 overflow-hidden">
      <aside className="w-64 bg-slate-900 text-white flex flex-col h-full">
        <div className="p-6 text-center border-b border-slate-700">
          <h1 className="text-xl font-bold text-blue-400">ATeG SIS</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="/" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-lg">
            <Home size={20} /> Dashboard
          </a>
          <a href="/bd-empresas" className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium">
            <Database size={20} /> BD_Empresas
          </a>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700">Banco de Dados</h2>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <input
            className="w-full max-w-md border rounded-lg px-4 py-2 mb-6"
            placeholder="Buscar empresa ou CNPJ..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                <tr><th className="p-4">STATUS</th><th className="p-4">RAZÃO SOCIAL</th><th className="p-4">AÇÃO</th></tr>
              </thead>
              <tbody className="divide-y">
                {empresasFiltradas.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-4">{emp.juridico_situacao || 'Aguardando'}</td>
                    <td className="p-4 font-bold">{emp.razao_social}</td>
                    <td className="p-4">
                      <button onClick={() => setEmpresaSelecionada(emp)} className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs">Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {empresaSelecionada && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setEmpresaSelecionada(null)}>
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex justify-between">
              <h3 className="font-bold truncate">{empresaSelecionada.razao_social}</h3>
              <button onClick={() => setEmpresaSelecionada(null)}><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {modoEdicao ? (
                <>
                  <label className="block text-xs font-bold text-slate-400 uppercase">Razão Social</label>
                  <input className="w-full border p-2 rounded" value={camposEditaveis.razao_social} onChange={v => handleCampo('razao_social', v.target.value)} />
                  <label className="block text-xs font-bold text-slate-400 uppercase">E-mail</label>
                  <input className="w-full border p-2 rounded" value={camposEditaveis.email_empresa} onChange={v => handleCampo('email_empresa', v.target.value)} />
                  <button onClick={salvarEdicao} className="w-full bg-emerald-600 text-white py-2 rounded font-bold">Salvar Alterações</button>
                  <button onClick={() => setModoEdicao(false)} className="w-full bg-red-600 text-white py-2 rounded">Cancelar</button>
                </>
              ) : (
                <>
                  <p><strong>CNPJ:</strong> {empresaSelecionada.cnpj}</p>
                  <p><strong>E-mail:</strong> {empresaSelecionada.email_empresa}</p>
                  <p><strong>Contrato:</strong> {empresaSelecionada.juridico_contrato}</p>
                  <button onClick={() => iniciarEdicao(empresaSelecionada)} className="w-full bg-blue-600 text-white py-2 rounded font-bold">Editar Empresa</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}