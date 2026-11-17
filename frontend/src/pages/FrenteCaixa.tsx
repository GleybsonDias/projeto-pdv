import React, { useState } from "react";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
}

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

const CATEGORIAS = ["Todas", "Bebidas", "Lanches", "Sobremesas", "Combos"];
const PRODUTOS: Produto[] = [
  { id: 1, nome: "Hambúrguer Clássico", preco: 25.9, categoria: "Lanches" },
  { id: 2, nome: "Refrigerante Cola", preco: 6.5, categoria: "Bebidas" },
  { id: 3, nome: "Batata Frita Média", preco: 12.0, categoria: "Lanches" },
  { id: 4, nome: "Cheesecake", preco: 15.0, categoria: "Sobremesas" },
  { id: 5, nome: "Água Mineral", preco: 4.0, categoria: "Bebidas" },
  { id: 6, nome: "Combo Burger + Fritas", preco: 35.0, categoria: "Combos" },
];

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

export default function FrenteCaixa() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);

  // LÓGICA DO CARRINHO (Corrigida para evitar o salto de +2)
  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho((prev) => {
      const index = prev.findIndex((item) => item.produto.id === produto.id);
      if (index >= 0) {
        // Usa o .map para criar um novo array e um novo objeto, respeitando a imutabilidade do React
        return prev.map((item, i) =>
          i === index ? { ...item, quantidade: item.quantidade + 1 } : item,
        );
      }
      return [...prev, { produto, quantidade: 1 }];
    });
  };

  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho((prev) => {
      const index = prev.findIndex((item) => item.produto.id === produtoId);
      if (index >= 0) {
        if (prev[index].quantidade > 1) {
          // Diminui a quantidade mantendo a imutabilidade
          return prev.map((item, i) =>
            i === index ? { ...item, quantidade: item.quantidade - 1 } : item,
          );
        } else {
          // Remove totalmente o item se a quantidade for 1
          return prev.filter((item) => item.produto.id !== produtoId);
        }
      }
      return prev;
    });
  };

  const produtosFiltrados =
    categoriaAtiva === "Todas"
      ? PRODUTOS
      : PRODUTOS.filter((p) => p.categoria === categoriaAtiva);

  // Cálculos Financeiros (Sem Impostos)
  const total = carrinho.reduce(
    (acc, item) => acc + item.produto.preco * item.quantidade,
    0,
  );

  return (
    <div className="h-full flex gap-6">
      {/* LADO ESQUERDO: Catálogo de Produtos */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <svg
              className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Pesquisar produto pelo nome ou código..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`px-5 py-2 rounded-lg font-medium whitespace-nowrap transition-all border ${
                categoriaAtiva === cat
                  ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                  : "bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {produtosFiltrados.map((produto) => (
              <div
                key={produto.id}
                onClick={() => adicionarAoCarrinho(produto)}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/80 active:scale-95 transition-all group flex flex-col h-32"
              >
                <div className="text-sm font-semibold text-slate-200 line-clamp-2 mb-auto group-hover:text-indigo-400 transition-colors">
                  {produto.nome}
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-xs text-slate-500">
                    {produto.categoria}
                  </span>
                  <span className="font-bold text-white">
                    {formatarMoeda(produto.preco)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LADO DIREITO: Carrinho / Talão */}
      <div className="w-96 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 bg-slate-900">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Venda Atual</h2>
            <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
              #00143
            </span>
          </div>
        </div>

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
    </div>
  );
}
