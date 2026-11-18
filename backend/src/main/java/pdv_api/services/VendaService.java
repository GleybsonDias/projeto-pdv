package pdv_api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pdv_api.models.Caixa;
import pdv_api.models.Cliente;
import pdv_api.models.Venda;
import pdv_api.repositories.CaixaRepository;
import pdv_api.repositories.ClienteRepository;
import pdv_api.repositories.VendaRepository;

import java.util.List;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private CaixaRepository caixaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

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

        venda.setCaixa(caixa);

        // 3. Se um cliente foi informado na venda, busca e vincula a entidade do banco
        if (venda.getCliente() != null && venda.getCliente().getId() != null) {
            Cliente cliente = clienteRepository.findById(venda.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Erro: Cliente não encontrado."));
            venda.setCliente(cliente);
        } else {
            venda.setCliente(null);
        }

        // 4. Salva a venda com o caixa e o cliente (se houver) devidamente vinculados
        return vendaRepository.save(venda);
    }
}