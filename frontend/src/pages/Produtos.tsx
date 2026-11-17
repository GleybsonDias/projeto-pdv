import React, { useState, useEffect } from "react";
import { api } from "../services/api";

interface Produto {
  id: number;
  codigoBarras: string;
  nome: string;
  preco: number;
  quantidadeEstoque: number;
}

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // ESTADOS DO MODAL
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState(""); // Novo estado para erros de validação

  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    preco: "",
    stock: "",
  });

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/produtos");
      setProdutos(response.data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setErro("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // Lógica para abrir o modal limpo
  const abrirModal = () => {
    setFormData({ codigo: "", nome: "", preco: "", stock: "" });
    setErroModal("");
    setModalAberto(true);
  };

  // VALIDAÇÕES E POST
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroModal(""); // Limpa erros antigos

    // 1. Validação do Nome (Máximo 150 caracteres)
    const nomeLimpo = formData.nome.trim();
    if (nomeLimpo.length === 0 || nomeLimpo.length > 150) {
      setErroModal(
        "O nome do produto é obrigatório e deve ter no máximo 150 caracteres.",
      );
      return;
    }

    // 2. Validação do Código de Barras (1 a 13 caracteres)
    const codigoLimpo = formData.codigo.trim();
    if (codigoLimpo.length < 1 || codigoLimpo.length > 13) {
      setErroModal("O código de barras deve ter entre 1 e 13 caracteres.");
      return;
    }

    // 3. Validação de Código Duplicado
    const codigoJaExiste = produtos.some((p) => p.codigoBarras === codigoLimpo);
    if (codigoJaExiste) {
      setErroModal(
        "Este código de barras já está cadastrado em outro produto!",
      );
      return;
    }

    // 4. Validação do Preço (Aceitar vírgula ou ponto e converter para float)
    // Substitui vírgula por ponto para o JavaScript conseguir converter
    const precoNumerico = Number(formData.preco.toString().replace(",", "."));
    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      setErroModal(
        "Insere um preço de venda válido e maior que zero (ex: 5.50 ou 5,50).",
      );
      return;
    }

    // 5. Validação do Estoque
    const estoqueNumerico = Number(formData.stock);
    if (isNaN(estoqueNumerico) || estoqueNumerico < 0) {
      setErroModal("O estoque não pode ser negativo.");
      return;
    }

    try {
      setSalvando(true);

      const payload = {
        nome: nomeLimpo,
        codigoBarras: codigoLimpo,
        precoVenda: precoNumerico,
        qtdEstoque: estoqueNumerico,
      };

      await api.post("/api/produtos", payload);

      setModalAberto(false);
      carregarProdutos(); // Recarrega a grelha
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      // Se der 403, avisa o utilizador que o token pode ter expirado
      if (error.response && error.response.status === 403) {
        setErroModal(
          "Acesso negado. A tua sessão pode ter expirado. Atualiza a página (F5) e tenta novamente.",
        );
      } else {
        setErroModal("Erro interno ao tentar salvar o produto no servidor.");
      }
    } finally {
      setSalvando(false);
    }
  };

  const produtosFiltrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      (p.codigoBarras &&
        p.codigoBarras.toLowerCase().includes(pesquisa.toLowerCase())),
  );

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Gestão de Produtos
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gere o catálogo, preços e stock do teu sistema.
          </p>
        </div>

        <button
          onClick={abrirModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Novo Produto
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-t-2xl p-4 flex gap-4 items-center">
        <div className="flex-1 relative max-w-md">
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
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
            placeholder="Pesquisar por nome ou código..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex-1 bg-slate-900/80 border-x border-b border-slate-800 rounded-b-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4 text-right">Preço</th>
                <th className="px-6 py-4 text-center">Estoque</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <svg
                        className="animate-spin h-8 w-8 text-indigo-500"
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
                        A carregar produtos do servidor...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : erro ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl inline-block">
                      {erro}
                    </div>
                  </td>
                </tr>
              ) : produtosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((produto) => (
                  <tr
                    key={produto.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-400">
                      {produto.codigoBarras || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-200">
                      {produto.nome}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-white text-right">
                      {formatarMoeda(produto.preco)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold ${
                          produto.quantidadeEstoque > 10
                            ? "bg-slate-800 text-slate-300"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {produto.quantidadeEstoque} un
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition-colors"
                          title="Editar"
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
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Eliminar"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">
                Cadastrar Produto
              </h2>
              <button
                onClick={() => setModalAberto(false)}
                className="text-slate-400 hover:text-white transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSalvar} className="p-6 space-y-4">
              {/* EXIBIÇÃO DE ERRO DE VALIDAÇÃO AQUI */}
              {erroModal && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4 flex items-start gap-2">
                  <svg
                    className="w-5 h-5 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>{erroModal}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Nome do Produto *
                </label>
                <input
                  required
                  type="text"
                  maxLength={150} // Limite HTML nativo
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Ex: Coca-Cola 2L"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Código (SKU/Barras) *
                </label>
                <input
                  required
                  type="text"
                  maxLength={13} // Limite HTML nativo para o padrão Varejo
                  value={formData.codigo}
                  onChange={(e) =>
                    setFormData({ ...formData, codigo: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                  placeholder="Ex: 789101010"
                />
                <div className="text-right mt-1 text-xs text-slate-500">
                  {formData.codigo.length}/13
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Preço Venda (R$) *
                  </label>
                  <input
                    required
                    type="text" // Alterado para text para aceitar vírgulas livremente
                    inputMode="decimal" // Mostra teclado numérico no mobile
                    value={formData.preco}
                    onChange={(e) =>
                      setFormData({ ...formData, preco: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="0,00"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Estoque *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Qtd"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {salvando ? "A guardar..." : "Guardar Produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
