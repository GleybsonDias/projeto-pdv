package pdv_api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pdv_api.models.Venda;
import pdv_api.models.Caixa;
import pdv_api.repositories.VendaRepository;
import pdv_api.repositories.CaixaRepository;

import java.util.List;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private CaixaRepository caixaRepository;

    public List<Venda> listarTodos() {
        return vendaRepository.findAll();
    }

    public Venda salvar(Venda venda) {
        // 1. Vai à base de dados procurar o Caixa pelo ID enviado na requisição
        Caixa caixa = caixaRepository.findById(venda.getCaixa().getId())
                .orElseThrow(() -> new RuntimeException("Erro: Caixa não encontrado."));

        // 2. Regra de Negócio: Se o status não for ABERTO, bloqueia a operação
        if (!"ABERTO".equals(caixa.getStatus())) {
            throw new RuntimeException("Operação negada: O caixa selecionado está " + caixa.getStatus());
        }

        // 3. Se passou pela regra, salva a venda normalmente
        return vendaRepository.save(venda);
    }
}