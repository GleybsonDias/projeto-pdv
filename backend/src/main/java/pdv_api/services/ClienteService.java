package pdv_api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pdv_api.models.Cliente;
import pdv_api.repositories.ClienteRepository;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Cliente salvar(Cliente cliente) {
        if (cliente.getCpf() != null && cliente.getCpf().isBlank()) {
            cliente.setCpf(null);
        }
        return clienteRepository.save(cliente);
    }

    public Cliente atualizar(Long id, Cliente dadosAtualizados) {
        Cliente clienteExistente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));

        clienteExistente.setNome(dadosAtualizados.getNome());

        String cpfLimpo = (dadosAtualizados.getCpf() != null && !dadosAtualizados.getCpf().isBlank())
                ? dadosAtualizados.getCpf().trim()
                : null;
        clienteExistente.setCpf(cpfLimpo);

        clienteExistente.setTelefone(dadosAtualizados.getTelefone());

        return clienteRepository.save(clienteExistente);
    }

    public void deletar(Long id) {
        clienteRepository.deleteById(id);
    }
}