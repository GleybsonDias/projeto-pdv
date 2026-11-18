import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
}

const formatarCPF = (valor: string) => {
  const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
  return apenasNumeros
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const formatarTelefone = (valor: string) => {
  const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
  if (apenasNumeros.length <= 10) {
    return apenasNumeros
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return apenasNumeros
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // ESTADOS DO MODAL DE CRIAR / EDITAR
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState("");
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  // ESTADOS DO MODAL DE EXCLUSÃO
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(
    null,
  );
  const [excluindo, setExcluindo] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
  });

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/clientes");
      setClientes(response.data);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
      setErro("Não foi possível carregar a lista de clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const abrirModalNovo = () => {
    setClienteEditando(null);
    setFormData({ nome: "", cpf: "", telefone: "" });
    setErroModal("");
    setModalAberto(true);
  };

  const abrirModalEditar = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setFormData({
      nome: cliente.nome || "",
      cpf: cliente.cpf || "",
      telefone: cliente.telefone || "",
    });
    setErroModal("");
    setModalAberto(true);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroModal("");

    // 1. Validação do Nome (Obrigatório, máx 150 caracteres)
    const nomeLimpo = formData.nome.trim();
    if (nomeLimpo.length === 0 || nomeLimpo.length > 150) {
      setErroModal(
        "O nome do cliente é obrigatório e deve ter no máximo 150 caracteres.",
      );
      return;
    }

    // 2. Validação do CPF (se preenchido, deve ter 11 dígitos numéricos / 14 com máscara)
    const cpfLimpo = formData.cpf.trim();
    const apenasDigitosCpf = cpfLimpo.replace(/\D/g, "");
    if (cpfLimpo.length > 0 && apenasDigitosCpf.length !== 11) {
      setErroModal("O CPF deve conter 11 dígitos válidos.");
      return;
    }

    // 3. Validação de CPF Duplicado na lista local
    if (cpfLimpo.length > 0) {
      const cpfJaExiste = clientes.some(
        (c) =>
          c.cpf &&
          c.cpf.replace(/\D/g, "") === apenasDigitosCpf &&
          c.id !== clienteEditando?.id,
      );
      if (cpfJaExiste) {
        setErroModal("Este CPF já está cadastrado em outro cliente!");
        return;
      }
    }

    // 4. Validação do Telefone
    const telefoneLimpo = formData.telefone.trim();
    if (telefoneLimpo.length > 20) {
      setErroModal("O telefone deve ter no máximo 20 caracteres.");
      return;
    }

    try {
      setSalvando(true);

      const payload = {
        nome: nomeLimpo,
        cpf: cpfLimpo.length > 0 ? cpfLimpo : null,
        telefone: telefoneLimpo.length > 0 ? telefoneLimpo : null,
      };

      if (clienteEditando) {
        await api.put(`/api/clientes/${clienteEditando.id}`, payload);
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await api.post("/api/clientes", payload);
        toast.success("Cliente cadastrado com sucesso!");
      }

      setModalAberto(false);
      setClienteEditando(null);
      carregarClientes();
    } catch (error: any) {
      console.error("Erro ao salvar cliente:", error);
      const mensagemBackend =
        typeof error.response?.data === "string" ? error.response.data : null;

      if (error.response?.status === 409) {
        setErroModal(mensagemBackend || "Este CPF já está cadastrado.");
      } else if (error.response?.status === 403) {
        setErroModal(
          "Acesso negado. A tua sessão pode ter expirado. Atualiza a página (F5) e tenta novamente.",
        );
      } else {
        setErroModal(
          mensagemBackend || "Erro interno ao tentar salvar o cliente.",
        );
      }
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = async () => {
    if (!clienteParaExcluir) return;

    try {
      setExcluindo(true);
      await api.delete(`/api/clientes/${clienteParaExcluir.id}`);
      toast.success(`"${clienteParaExcluir.nome}" excluído com sucesso!`);
      setClienteParaExcluir(null);
      carregarClientes();
    } catch (error: any) {
      console.error("Erro ao excluir cliente:", error);
      const mensagemBackend =
        typeof error.response?.data === "string" ? error.response.data : null;

      if (error.response?.status === 409) {
        toast.error(
          mensagemBackend ||
            "Este cliente não pode ser excluído pois já possui vendas vinculadas.",
        );
        setClienteParaExcluir(null);
      } else if (error.response?.status === 403) {
        toast.error("Sessão expirada. Atualize a página e tente novamente.");
      } else {
        toast.error(mensagemBackend || "Não foi possível excluir o cliente.");
      }
    } finally {
      setExcluindo(false);
    }
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      c.cpf?.includes(pesquisa) ||
      c.telefone?.includes(pesquisa),
  );

  return (
    <div className="h-full flex flex-col relative">
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Gestão de Clientes
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gere a tua base de clientes, contactos e histórico.
          </p>
        </div>

        <button
          onClick={abrirModalNovo}
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          Novo Cliente
        </button>
      </div>

      {/* Barra de Ferramentas (Pesquisa) */}
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
            placeholder="Pesquisar por nome, CPF ou telefone..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="flex-1 bg-slate-900/80 border-x border-b border-slate-800 rounded-b-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">CPF</th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4 text-center">Estado</th>
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
                        A carregar clientes...
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
              ) : clientesFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-slate-200">
                      {cliente.nome}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-400 font-mono">
                      {cliente.cpf || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {cliente.telefone || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Ativo
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => abrirModalEditar(cliente)}
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
                          onClick={() => setClienteParaExcluir(cliente)}
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

      {/* MODAL DE CRIAR / EDITAR CLIENTE */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">
                {clienteEditando ? "Editar Cliente" : "Cadastrar Cliente"}
              </h2>
              <button
                onClick={() => {
                  setModalAberto(false);
                  setClienteEditando(null);
                }}
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
                  Nome Completo *
                </label>
                <input
                  required
                  type="text"
                  maxLength={150}
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  maxLength={14}
                  value={formData.cpf}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cpf: formatarCPF(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      telefone: formatarTelefone(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setModalAberto(false);
                    setClienteEditando(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {salvando
                    ? "A guardar..."
                    : clienteEditando
                      ? "Salvar Alterações"
                      : "Guardar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {clienteParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-400">
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Excluir Cliente?
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Tem certeza que deseja excluir{" "}
              <span className="text-white font-semibold">
                "{clienteParaExcluir.nome}"
              </span>
              ? Esta ação não poderá ser desfeita.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={excluindo}
                onClick={() => setClienteParaExcluir(null)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={excluindo}
                onClick={handleConfirmarExclusao}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {excluindo ? "Excluindo..." : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
