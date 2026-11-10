package pdv_api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pdv_api.models.Caixa;
import pdv_api.repositories.CaixaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CaixaService {

    @Autowired
    private CaixaRepository caixaRepository;

    public List<Caixa> listarTodos() {
        return caixaRepository.findAll();
    }

    public Caixa abrirCaixa(Caixa caixa) {
        caixa.setStatus("ABERTO");
        // A dataAbertura já é gerada automaticamente pelo @CreationTimestamp no Model
        return caixaRepository.save(caixa);
    }

    public Caixa fecharCaixa(Long id) {
        Caixa caixa = caixaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caixa não encontrado"));

        if ("FECHADO".equals(caixa.getStatus())) {
            throw new RuntimeException("O caixa já se encontra fechado.");
        }

        caixa.setStatus("FECHADO");
        caixa.setDataFechamento(LocalDateTime.now());
        return caixaRepository.save(caixa);
    }
}