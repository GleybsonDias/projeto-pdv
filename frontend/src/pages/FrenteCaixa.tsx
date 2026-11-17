import React, { useState, useEffect } from "react";
import { api } from "../services/api";

// Tipagem idêntica à do Produtos.tsx
interface Produto {
  id: number;
  codigoBarras: string;
  nome: string;
  preco: number;
  quantidadeEstoque: number;
}

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

export default function FrenteCaixa() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [pesquisa, setPesquisa] = useState("");
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);

  useEffect(() => {
    const carregarCatalogo = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/produtos");
        // A tua API já devolve tudo, não filtramos por status pois não existe
        setProdutos(response.data);
      } catch (err) {
        console.error("Erro ao carregar catálogo:", err);
        setErro("Falha ao comunicar com o servidor. Verifica a tua ligação.");
      } finally {
        setLoading(false);
      }
    };

    carregarCatalogo();
  }, []);

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho((prev) => {
      const index = prev.findIndex((item) => item.produto.id === produto.id);
      if (index >= 0) {
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
          return prev.map((item, i) =>
            i === index ? { ...item, quantidade: item.quantidade - 1 } : item,
          );
        } else {
          return prev.filter((item) => item.produto.id !== produtoId);
        }
      }
      return prev;
    });
  };

  // Filtro atualizado para usar p.codigoBarras
  const produtosFiltrados = produtos.filter((p) => {
    return (
      p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      (p.codigoBarras &&
        p.codigoBarras.toLowerCase().includes(pesquisa.toLowerCase()))
    );
  });

  const total = carrinho.reduce(
    (acc, item) => acc + item.produto.preco * item.quantidade,
    0,
  );

  return (
    <div className="h-full flex gap-6">
      {/* LADO ESQUERDO */}
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
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <svg
                className="animate-spin h-10 w-10 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-slate-400 font-medium">
                A carregar catálogo...
              </span>
            </div>
          )}

          {!loading && erro && (
            <div className="flex items-center justify-center h-64">
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
                <p className="font-semibold mb-1">Ops!</p>
                <p className="text-sm">{erro}</p>
              </div>
            </div>
          )}

          {!loading && !erro && produtosFiltrados.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <svg
                className="w-16 h-16 mb-4 opacity-20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p>Nenhum produto encontrado.</p>
            </div>
          )}

          {!loading && !erro && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {produtosFiltrados.map((produto) => (
                <div
                  key={produto.id}
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/80 active:scale-95 transition-all group flex flex-col h-32 relative overflow-hidden"
                >
                  {produto.codigoBarras && (
                    <span className="absolute top-2 right-2 text-[10px] font-mono text-slate-500 bg-slate-950/50 px-1.5 py-0.5 rounded">
                      {produto.codigoBarras}
                    </span>
                  )}

                  <div className="text-sm font-semibold text-slate-200 line-clamp-2 mb-auto mt-2 group-hover:text-indigo-400 transition-colors">
                    {produto.nome}
                  </div>
                  <div className="flex justify-end items-end mt-2">
                    <span className="font-bold text-white text-lg">
                      {formatarMoeda(produto.preco)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="w-96 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 bg-slate-900">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Venda Atual</h2>
            <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
              Nova Venda
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
            onClick={() => alert("Pronto para fechar venda no Spring Boot!")}
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
