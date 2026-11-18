import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { toast } from "react-hot-toast";

// Importação dos nossos novos componentes visuais!
import CaixaFechado from "../components/pdv/CaixaFechado";
import CatalogoProdutos from "../components/pdv/CatalogoProdutos";
import ResumoCarrinho from "../components/pdv/ResumoCarrinho";
import ModalCheckout from "../components/pdv/ModalCheckout";

// Importação das tipagens para manter o TypeScript feliz
import type { Produto } from "../components/pdv/CatalogoProdutos";
import type { ItemCarrinho } from "../components/pdv/ResumoCarrinho";

interface Caixa {
  id: number;
  saldoInicial: number;
  status: string;
  dataAbertura: string;
}

export default function FrenteCaixa() {
  const { usuario } = useAuth();

  // ================= ESTADOS =================
  const [caixaAtivo, setCaixaAtivo] = useState<Caixa | null>(null);
  const [verificandoCaixa, setVerificandoCaixa] = useState(true);
  const [saldoInicial, setSaldoInicial] = useState("");
  const [processandoCaixa, setProcessandoCaixa] = useState(false);

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);

  const [modalPagamento, setModalPagamento] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState("DINHEIRO");
  const [processando, setProcessando] = useState(false);

  // ================= EFEITOS =================
  useEffect(() => {
    verificarStatusCaixa();
  }, []);

  // ================= LÓGICA DE NEGÓCIO =================
  const verificarStatusCaixa = async () => {
    try {
      setVerificandoCaixa(true);
      const response = await api.get("/api/caixas");
      const caixaAberto = response.data.find(
        (c: Caixa) => c.status === "ABERTO",
      );

      if (caixaAberto) {
        setCaixaAtivo(caixaAberto);
        carregarCatalogo();
      } else {
        setCaixaAtivo(null);
      }
    } catch (err) {
      console.error("Erro ao verificar caixa:", err);
      setErro("Falha ao comunicar com o servidor para verificar o caixa.");
    } finally {
      setVerificandoCaixa(false);
    }
  };

  const handleAbrirCaixa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario?.uid)
      return alert("Erro de autenticação: Utilizador não identificado.");

    const saldoNum = Number(saldoInicial.replace(",", "."));
    if (isNaN(saldoNum) || saldoNum < 0)
      return alert("Por favor, insere um saldo inicial válido.");

    try {
      setProcessandoCaixa(true);
      await api.post("/api/caixas/abrir", {
        saldoInicial: saldoNum,
        status: "ABERTO",
        usuario: { id: usuario.uid },
      });
      verificarStatusCaixa();
      setSaldoInicial("");
    } catch (error) {
      console.error("Erro ao abrir caixa:", error);
      alert("Erro ao abrir o caixa. Verifica a consola.");
    } finally {
      setProcessandoCaixa(false);
    }
  };

  const handleFecharCaixa = async () => {
    if (!caixaAtivo) return;
    if (!window.confirm("Tens a certeza que queres fechar o caixa atual?"))
      return;

    try {
      setProcessandoCaixa(true);
      await api.put(`/api/caixas/${caixaAtivo.id}/fechar`);
      alert("Caixa fechado com sucesso!");
      setCaixaAtivo(null);
      setCarrinho([]);
    } catch (error) {
      console.error("Erro ao fechar caixa:", error);
      alert("Erro ao fechar o caixa.");
    } finally {
      setProcessandoCaixa(false);
    }
  };

  const carregarCatalogo = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/produtos");
      setProdutos(response.data);
    } catch (err) {
      console.error("Erro ao carregar catálogo:", err);
      setErro("Falha ao comunicar com o servidor. Verifica a tua ligação.");
    } finally {
      setLoading(false);
    }
  };

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
        }
        return prev.filter((item) => item.produto.id !== produtoId);
      }
      return prev;
    });
  };

  const handleFinalizarVenda = async (clienteId?: number | null) => {
    if (!caixaAtivo) {
      toast.error("Nenhum caixa aberto!");
      return;
    }

    // 1. Verifica antes de criar a venda se algum item do carrinho ultrapassa o estoque disponível
    const itemSemEstoque = carrinho.find(
      (item) => item.quantidade > item.produto.quantidadeEstoque,
    );

    if (itemSemEstoque) {
      toast.error(
        `Estoque insuficiente para "${itemSemEstoque.produto.nome}". Disponível: ${itemSemEstoque.produto.quantidadeEstoque} un.`,
      );
      return;
    }

    try {
      setProcessando(true);
      const responseVenda = await api.post("/api/vendas", {
        caixa: { id: caixaAtivo.id },
        valorTotal: total,
        formaPagamento: formaPagamento,
        statusPagamento: "APROVADO",
        clienteId: clienteId ?? null,
        cliente: clienteId ? { id: clienteId } : null,
      });
      const vendaCriada = responseVenda.data;

      const promessasItens = carrinho.map((item) => {
        return api.post("/api/itens-venda", {
          venda: { id: vendaCriada.id },
          produto: { id: item.produto.id },
          quantidade: item.quantidade,
          precoUnitario: item.produto.preco,
        });
      });

      await Promise.all(promessasItens);

      // 2. Atualiza o estoque local na tela do PDV imediatamente
      setProdutos((produtosAtuais) =>
        produtosAtuais.map((prod) => {
          const itemVendido = carrinho.find((i) => i.produto.id === prod.id);
          if (itemVendido) {
            return {
              ...prod,
              quantidadeEstoque:
                prod.quantidadeEstoque - itemVendido.quantidade,
            };
          }
          return prod;
        }),
      );

      setModalPagamento(false);
      setCarrinho([]);
      toast.success("Venda finalizada com sucesso! 🎉");
    } catch (error: any) {
      console.error("Erro ao finalizar venda:", error);
      const msgBackend =
        typeof error.response?.data === "string" ? error.response.data : null;
      toast.error(msgBackend || "Erro ao finalizar a venda.");
    } finally {
      setProcessando(false);
    }
  };

  // ================= VARIÁVEIS DERIVADAS =================
  const produtosFiltrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      (p.codigoBarras &&
        p.codigoBarras.toLowerCase().includes(pesquisa.toLowerCase())),
  );

  const total = carrinho.reduce(
    (acc, item) => acc + item.produto.preco * item.quantidade,
    0,
  );

  // ================= RENDERIZAÇÃO =================

  // 1. Ecrã de Loading Inicial
  if (verificandoCaixa) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
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
          A verificar status do caixa...
        </span>
      </div>
    );
  }

  // 2. Ecrã de Caixa Fechado
  if (!caixaAtivo) {
    return (
      <CaixaFechado
        saldoInicial={saldoInicial}
        setSaldoInicial={setSaldoInicial}
        handleAbrirCaixa={handleAbrirCaixa}
        processandoCaixa={processandoCaixa}
      />
    );
  }

  // 3. Ecrã Principal da Frente de Caixa
  return (
    <div className="h-full flex gap-6 relative">
      <CatalogoProdutos
        pesquisa={pesquisa}
        setPesquisa={setPesquisa}
        loading={loading}
        erro={erro}
        produtosFiltrados={produtosFiltrados}
        adicionarAoCarrinho={adicionarAoCarrinho}
      />

      <ResumoCarrinho
        carrinho={carrinho}
        total={total}
        removerDoCarrinho={removerDoCarrinho}
        setModalPagamento={setModalPagamento}
        handleFecharCaixa={handleFecharCaixa}
        processandoCaixa={processandoCaixa}
      />

      {modalPagamento && (
        <ModalCheckout
          total={total}
          formaPagamento={formaPagamento}
          setFormaPagamento={setFormaPagamento}
          setModalPagamento={setModalPagamento}
          handleFinalizarVenda={handleFinalizarVenda}
          processando={processando}
        />
      )}
    </div>
  );
}
