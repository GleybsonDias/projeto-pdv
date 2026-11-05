package pdv_api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pdv_api.models.ItemVenda;
import pdv_api.repositories.ItemVendaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ItemVendaService {

    @Autowired
    private ItemVendaRepository itemVendaRepository;

    public List<ItemVenda> listarTodos() {
        return itemVendaRepository.findAll();
    }

    public Optional<ItemVenda> buscarPorId(Long id) {
        return itemVendaRepository.findById(id);
    }

    public ItemVenda salvar(ItemVenda itemVenda) {
        return itemVendaRepository.save(itemVenda);
    }

    public void deletar(Long id) {
        itemVendaRepository.deleteById(id);
    }
}