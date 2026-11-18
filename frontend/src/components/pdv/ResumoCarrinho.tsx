import type { Produto } from "./CatalogoProdutos"; // Reaproveitamos a interface que exportámos no passo anterior!

// Exportamos esta interface porque o FrenteCaixa e o Modal vão precisar dela
export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

interface ResumoCarrinhoProps {
  carrinho: ItemCarrinho[];
  total: number;
  removerDoCarrinho: (produtoId: number) => void;
  setModalPagamento: (aberto: boolean) => void;
  handleFecharCaixa: () => void;
  processandoCaixa: boolean;
}

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

export default function ResumoCarrinho({
  carrinho,
  total,
  removerDoCarrinho,
  setModalPagamento,
  handleFecharCaixa,
  processandoCaixa,
}: ResumoCarrinhoProps) {
  return (
    <div className="w-96 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
      {/* CABEÇALHO DO CARRINHO */}
      <div className="p-5 border-b border-slate-800 bg-slate-900">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Venda Atual</h2>

          <button
            onClick={handleFecharCaixa}
            disabled={processandoCaixa}
            className="text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Fechar Caixa
          </button>
        </div>
      </div>

      {/* LISTA DE ITENS */}
      <div className="flex-1 overflow-y-auto p-2">
        {carrinho.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
            <svg
              className="w-12 h-12 opacity-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-sm font-medium">Carrinho vazio</p>
          </div>
        ) : (
          carrinho.map((item) => (
            <div
              key={item.produto.id}
              className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg mb-2 border border-slate-700/50 group"
            >
              <div className="flex flex-col items-center justify-center bg-slate-800 rounded-md w-8 h-8 text-sm font-bold text-slate-300">
                {item.quantidade}x
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">
                  {item.produto.nome}
                </p>
                <p className="text-xs text-slate-500">
                  {formatarMoeda(item.produto.preco)} / un
                </p>
              </div>
              <div className="font-bold text-white text-right">
                {formatarMoeda(item.produto.preco * item.quantidade)}
              </div>
              <button
                onClick={() => removerDoCarrinho(item.produto.id)}
                className="w-6 h-6 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* RODAPÉ E BOTÃO COBRAR */}
      <div className="p-5 bg-slate-950/50 border-t border-slate-800">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Subtotal</span>
            <span>{formatarMoeda(total)}</span>
          </div>
          <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-800">
            <span className="text-slate-300 font-medium">Total a Pagar</span>
            <span className="text-3xl font-bold text-white">
              {formatarMoeda(total)}
            </span>
          </div>
        </div>

        <button
          disabled={carrinho.length === 0}
          onClick={() => setModalPagamento(true)}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Cobrar
        </button>
      </div>
    </div>
  );
}
