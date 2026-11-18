// Exportamos a interface Produto para poder reutilizá-la depois noutros componentes
export interface Produto {
  id: number;
  codigoBarras: string;
  nome: string;
  preco: number;
  quantidadeEstoque: number;
}

interface CatalogoProdutosProps {
  pesquisa: string;
  setPesquisa: (valor: string) => void;
  loading: boolean;
  erro: string;
  produtosFiltrados: Produto[];
  adicionarAoCarrinho: (produto: Produto) => void;
}

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

export default function CatalogoProdutos({
  pesquisa,
  setPesquisa,
  loading,
  erro,
  produtosFiltrados,
  adicionarAoCarrinho,
}: CatalogoProdutosProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* BARRA DE PESQUISA */}
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

      {/* ÁREA DA GRELHA DE PRODUTOS */}
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

        {!loading && !erro && produtosFiltrados.length > 0 && (
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
  );
}
