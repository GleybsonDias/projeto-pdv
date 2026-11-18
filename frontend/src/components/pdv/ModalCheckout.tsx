import React, { useState } from "react";
import { api } from "../../services/api";
import toast from "react-hot-toast";

interface ModalCheckoutProps {
  total: number;
  formaPagamento: string;
  setFormaPagamento: (forma: string) => void;
  setModalPagamento: (aberto: boolean) => void;
  handleFinalizarVenda: () => void;
  processando: boolean;
}

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

export default function ModalCheckout({
  total,
  formaPagamento,
  setFormaPagamento,
  setModalPagamento,
  handleFinalizarVenda,
  processando,
}: ModalCheckoutProps) {
  const [loadingPix, setLoadingPix] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);
  const [dadosPix, setDadosPix] = useState<{
    qrCodeBase64?: string;
    copiaECola?: string;
  } | null>(null);
  const [linkPagamento, setLinkPagamento] = useState<string | null>(null);

  const handleGerarPix = async () => {
    try {
      setLoadingPix(true);
      const response = await api.post("/api/pagamentos/criar-pix", {
        titulo: "Venda - PDV Balcão",
        valor: total,
        quantidade: 1,
      });

      const payment = response.data;
      const transactionData = payment.pointOfInteraction?.transactionData;

      if (transactionData) {
        setDadosPix({
          qrCodeBase64: transactionData.qrCodeBase64,
          copiaECola: transactionData.qrCode,
        });
        toast.success("QR Code Pix gerado com sucesso!");
      } else {
        toast.error("Erro ao obter dados do Pix.");
      }
    } catch (error) {
      console.error("Erro ao gerar Pix:", error);
      toast.error("Erro ao comunicar com o servidor para gerar o Pix.");
    } finally {
      setLoadingPix(false);
    }
  };

  const handleGerarLinkCartao = async () => {
    try {
      setLoadingLink(true);
      const response = await api.post("/api/pagamentos/criar-preferencia", {
        titulo: "Venda - PDV Cartão Online",
        valor: total,
        quantidade: 1,
      });

      const preference = response.data;
      const urlCheckout = preference?.initPoint || preference?.sandboxInitPoint;

      if (urlCheckout) {
        setLinkPagamento(urlCheckout);
        toast.success("Link de pagamento gerado com sucesso!");
        window.open(urlCheckout, "_blank");
      } else {
        toast.error("Erro ao gerar link de pagamento.");
      }
    } catch (error) {
      console.error("Erro ao gerar link de cartão:", error);
      toast.error("Erro ao comunicar com o servidor.");
    } finally {
      setLoadingLink(false);
    }
  };

  const copiarCodigoCopiaECola = () => {
    if (dadosPix?.copiaECola) {
      navigator.clipboard.writeText(dadosPix.copiaECola);
      toast.success("Código Pix Copia e Cola copiado!");
    }
  };

  const copiarLinkPagamento = () => {
    if (linkPagamento) {
      navigator.clipboard.writeText(linkPagamento);
      toast.success("Link de pagamento copiado!");
    }
  };

  const acaoBotaoPrincipal = () => {
    if (formaPagamento === "PIX" && !dadosPix) {
      handleGerarPix();
      return;
    }

    if (formaPagamento === "CARTAO_ONLINE" && !linkPagamento) {
      handleGerarLinkCartao();
      return;
    }

    // Se o Pix ou Link já foram gerados (ou se for DINHEIRO / CARTAO_FISICO), finaliza a venda no PDV
    handleFinalizarVenda();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Finalizar Venda</h2>
          <button
            onClick={() => setModalPagamento(false)}
            className="text-slate-400 hover:text-white transition-colors"
            disabled={processando || loadingPix || loadingLink}
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

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-slate-400 text-sm mb-1">Total a cobrar</p>
            <p className="text-4xl font-bold text-white">
              {formatarMoeda(total)}
            </p>
          </div>

          {formaPagamento === "PIX" && dadosPix ? (
            <div className="space-y-4 mb-6 text-center bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <p className="text-sm font-semibold text-emerald-400">
                Escaneie o QR Code abaixo com o app do banco:
              </p>
              {dadosPix.qrCodeBase64 && (
                <div className="bg-white p-2 inline-block rounded-xl shadow-md">
                  <img
                    src={`data:image/png;base64,${dadosPix.qrCodeBase64}`}
                    alt="QR Code Pix"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
              )}
              <div>
                <button
                  onClick={copiarCodigoCopiaECola}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2"
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
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  Copiar Código Pix (Copia e Cola)
                </button>
              </div>
            </div>
          ) : formaPagamento === "CARTAO_ONLINE" && linkPagamento ? (
            <div className="mb-6 p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-center space-y-3">
              <p className="text-sm font-semibold text-emerald-400">
                Link de pagamento pronto!
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={linkPagamento}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Abrir Checkout do Mercado Pago 🚀
                </a>
                <button
                  onClick={copiarLinkPagamento}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-700"
                >
                  Copiar Link para enviar ao cliente
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Forma de Pagamento
              </label>

              {[
                { id: "DINHEIRO", label: "Dinheiro" },
                { id: "PIX", label: "Pix (QR Code Nativo)" },
                { id: "CARTAO_FISICO", label: "Cartão (Maquininha Física)" },
                { id: "CARTAO_ONLINE", label: "Cartão (Gerar Link Externo)" },
              ].map((metodo) => (
                <label
                  key={metodo.id}
                  onClick={() => {
                    setDadosPix(null);
                    setLinkPagamento(null);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer border transition-all ${
                    formaPagamento === metodo.id
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                      : "bg-slate-950/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="pagamento"
                    value={metodo.id}
                    checked={formaPagamento === metodo.id}
                    onChange={(e) => {
                      setFormaPagamento(e.target.value);
                      setDadosPix(null);
                      setLinkPagamento(null);
                    }}
                    className="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-600 focus:ring-offset-slate-900"
                  />
                  <span className="font-semibold text-sm">{metodo.label}</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setModalPagamento(false);
                setDadosPix(null);
                setLinkPagamento(null);
              }}
              disabled={processando || loadingPix || loadingLink}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={acaoBotaoPrincipal}
              disabled={processando || loadingPix || loadingLink}
              className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              {loadingPix
                ? "A gerar Pix..."
                : loadingLink
                  ? "A gerar Link..."
                  : processando
                    ? "A processar..."
                    : formaPagamento === "PIX" && !dadosPix
                      ? "Gerar QR Code Pix"
                      : formaPagamento === "CARTAO_ONLINE" && !linkPagamento
                        ? "Gerar Link de Cartão"
                        : "Confirmar Venda"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
