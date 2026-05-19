import React from 'react';
import { Home, Briefcase, FileText, Users, Bell, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* MENU LATERAL */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-center border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">ATeG SIS</h1>
          <p className="text-xs text-slate-400 mt-1">Gestão de Contratos</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium shadow-md">
            <Home size={20} /> Dashboard Geral
          </a>
          <a href="#" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-lg transition-colors">
            <Briefcase size={20} /> Empresas e Técnicos
          </a>
          <a href="#" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-lg transition-colors">
            <FileText size={20} /> Controle Jurídico
          </a>
          <a href="#" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 px-4 py-3 rounded-lg transition-colors">
            <Users size={20} /> Equipe
          </a>
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* CABEÇALHO */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700">Visão Geral</h2>
          
          <div className="flex items-center gap-6">
            <button className="relative text-gray-500 hover:text-blue-600 transition-colors">
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                3
              </span>
            </button>
            
            <div className="flex items-center gap-3 border-l pl-6">
              <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold border border-blue-200">
                C
              </div>
              <span className="text-sm font-semibold text-gray-700">Equipe Admin</span>
            </div>
          </div>
        </header>

        {/* CONTEÚDO DO DASHBOARD */}
        <div className="flex-1 overflow-auto p-8">
          
          <h3 className="text-gray-500 text-sm font-semibold mb-4 uppercase tracking-wider">Indicadores Principais</h3>
          
          {/* CARDS DE KPI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-emerald-500 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Empresas Ativas</p>
                <h3 className="text-3xl font-bold text-gray-800">142</h3>
              </div>
              <div className="p-4 bg-emerald-50 rounded-full text-emerald-600">
                <CheckCircle size={28} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Técnicos / Supervisores</p>
                <h3 className="text-3xl font-bold text-gray-800">87</h3>
              </div>
              <div className="p-4 bg-blue-50 rounded-full text-blue-600">
                <Users size={28} />
              </div>
            </div>

            <div className="bg-red-50 rounded-xl shadow-sm p-6 border-l-4 border-red-500 flex justify-between items-center">
              <div>
                <p className="text-sm text-red-600 font-bold mb-1">Vencendo em &lt; 60 dias</p>
                <h3 className="text-3xl font-bold text-red-700">03</h3>
              </div>
              <div className="p-4 bg-red-100 rounded-full text-red-600 animate-pulse">
                <AlertTriangle size={28} />
              </div>
            </div>
          </div>

          {/* TABELA DE ALERTAS */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="text-md font-bold text-gray-800">Atenção Imediata: Contratos Próximos do Vencimento</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-gray-500 text-xs uppercase tracking-wider bg-white">
                    <th className="p-4 font-semibold">Empresa</th>
                    <th className="p-4 font-semibold">Técnico</th>
                    <th className="p-4 font-semibold">Vigência</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b bg-red-50/50 hover:bg-red-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-800">AgroNorte Serviços</td>
                    <td className="p-4 text-gray-600">João Silva</td>
                    <td className="p-4 font-medium text-gray-800">10/06/2026</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Vence em 22 dias
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b bg-red-50/50 hover:bg-red-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-800">Verde Campo Consultoria</td>
                    <td className="p-4 text-gray-600">Maria Souza</td>
                    <td className="p-4 font-medium text-gray-800">25/06/2026</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Vence em 37 dias
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}