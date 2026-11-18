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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Finalizar Venda</h2>
          <button
            onClick={() => setModalPagamento(false)}
            className="text-slate-400 hover:text-white transition-colors"
            disabled={processando}
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

          <div className="space-y-3 mb-8">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Forma de Pagamento
            </label>

            {["DINHEIRO", "PIX", "CARTAO_CREDITO"].map((metodo) => (
              <label
                key={metodo}
                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-all ${
                  formaPagamento === metodo
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                    : "bg-slate-950/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <input
                  type="radio"
                  name="pagamento"
                  value={metodo}
                  checked={formaPagamento === metodo}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                  className="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-600 focus:ring-offset-slate-900"
                />
                <span className="font-semibold">
                  {metodo === "CARTAO_CREDITO"
                    ? "Cartão de Crédito/Débito"
                    : metodo}
                </span>
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setModalPagamento(false)}
              disabled={processando}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleFinalizarVenda}
              disabled={processando}
              className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processando ? "Processando..." : "Confirmar Pagamento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
