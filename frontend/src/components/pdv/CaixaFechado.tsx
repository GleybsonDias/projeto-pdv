import React from "react";

interface CaixaFechadoProps {
  saldoInicial: string;
  setSaldoInicial: (valor: string) => void;
  handleAbrirCaixa: (e: React.FormEvent) => void;
  processandoCaixa: boolean;
}

export default function CaixaFechado({
  saldoInicial,
  setSaldoInicial,
  handleAbrirCaixa,
  processandoCaixa,
}: CaixaFechadoProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Caixa Fechado</h2>
        <p className="text-slate-400 text-sm mb-6">
          Para iniciares as tuas vendas, abre o caixa informando o saldo inicial
          (troco).
        </p>

        <form onSubmit={handleAbrirCaixa} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Saldo Inicial (R$)
            </label>
            <input
              required
              type="text"
              inputMode="decimal"
              value={saldoInicial}
              onChange={(e) => setSaldoInicial(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold text-lg"
              placeholder="0,00"
            />
          </div>
          <button
            type="submit"
            disabled={processandoCaixa}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processandoCaixa ? "A abrir..." : "Abrir Caixa"}
          </button>
        </form>
      </div>
    </div>
  );
}
